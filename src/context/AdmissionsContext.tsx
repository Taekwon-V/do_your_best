'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ChildProfile,
  SemesterCourseGrade,
  FamilyAppData,
  MockExamRecord,
  MainTabKey,
  TargetUniversity,
} from '@/types/admissions';
import { INITIAL_FAMILY_DATA } from '@/data/initialData';
import { calculateWeightedGPA } from '@/utils/gpaCalculator';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface AdmissionsContextType {
  childrenList: ChildProfile[];
  activeChildId: string;
  activeChild: ChildProfile;
  activeTab: MainTabKey;
  setActiveTab: (tab: MainTabKey) => void;
  targetGPA: number;
  setTargetGPA: (gpa: number) => void;
  switchChild: (childId: string) => void;
  updateChildName: (childId: string, name: string) => void;
  updateTargetField: (childId: string, field: string) => void;
  addCourse: (childId: string, course: SemesterCourseGrade) => void;
  updateCourse: (childId: string, course: SemesterCourseGrade) => void;
  updateMultipleCourses: (childId: string, courses: SemesterCourseGrade[]) => void;
  deleteCourse: (childId: string, courseId: string) => void;
  addMockExam: (childId: string, exam: MockExamRecord) => void;
  updateMockExam: (childId: string, exam: MockExamRecord) => void;
  deleteMockExam: (childId: string, examId: string) => void;
  addTargetUniversity: (childId: string, target: TargetUniversity) => void;
  updateTargetUniversity: (childId: string, target: TargetUniversity) => void;
  deleteTargetUniversity: (childId: string, targetId: string) => void;
  calculateCumulativeGPA: (courses: SemesterCourseGrade[]) => number;
  calculateDDay: (targetDateStr: string) => number;
  exportDataAsJSON: () => void;
  importDataFromJSON: (jsonString: string) => boolean;
  resetToInitialData: () => void;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

const FAMILY_DATA_STORAGE_KEY = 'admission_app_family_data';
const TARGET_GPA_STORAGE_KEY = 'admission_app_target_gpa';
const ACTIVE_TAB_STORAGE_KEY = 'admission_app_active_tab';

export function AdmissionsProvider({ children }: { children: React.ReactNode }) {
  const [familyData, setFamilyData] = useState<FamilyAppData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.children && parsed.children.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Initial storage parse error:', e);
      }
    }
    return INITIAL_FAMILY_DATA;
  });

  const [targetGPA, setTargetGPAState] = useState<number>(1.15);
  const [activeTab, setActiveTabState] = useState<MainTabKey>('home');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 초기 로컬스토리지 복구 (타겟 GPA 및 액티브 탭)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.children && parsed.children.length > 0) {
          setFamilyData(parsed);
        }
      }
      const savedTarget = localStorage.getItem(TARGET_GPA_STORAGE_KEY);
      if (savedTarget) {
        setTargetGPAState(parseFloat(savedTarget));
      }
      const savedTab = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) as MainTabKey;
      if (savedTab && ['home', 'susi', 'jeongsi', 'targets', 'reports'].includes(savedTab)) {
        setActiveTabState(savedTab);
      }
    } catch (e) {
      console.error('Failed to load admissions data from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 클라우드 백업 전송 헬퍼
  const syncToCloud = (data: FamilyAppData) => {
    if (!db) return;
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      setDoc(familyDocRef, data, { merge: true }).catch((err) => {
        console.warn('Firestore cloud sync notice:', err.message);
      });
    } catch (err) {
      console.warn('Cloud sync error:', err);
    }
  };

  // 2. Cloud Firestore 실시간 리스너 연결 (타임스탬프 기반 안전 동기화)
  useEffect(() => {
    if (!db) return;
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      const unsubscribe = onSnapshot(
        familyDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as FamilyAppData;
            if (cloudData && cloudData.children && cloudData.children.length > 0) {
              const localSaved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
              const localData: FamilyAppData | null = localSaved ? JSON.parse(localSaved) : null;
              const localTimestamp = localData?.updatedAt || 0;
              const cloudTimestamp = cloudData.updatedAt || 0;

              // 클라우드 데이터가 로컬보다 최신일 때만 로컬 갱신
              if (cloudTimestamp > localTimestamp) {
                setFamilyData(cloudData);
                localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
              } else if (localTimestamp > cloudTimestamp) {
                // 로컬 데이터가 더 최신이면 클라우드에 업로드
                if (localData) {
                  syncToCloud(localData);
                }
              }
            }
          }
        },
        (error) => {
          console.warn('Firestore sync listener notice (offline fallback active):', error.message);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }, []);

  const setActiveTab = (tab: MainTabKey) => {
    setActiveTabState(tab);
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab);
  };

  // 로컬 & 클라우드 동시 영속화 함수 (타임스탬프 부여)
  const saveFamilyData = (newData: FamilyAppData) => {
    const dataWithTimestamp: FamilyAppData = {
      ...newData,
      updatedAt: Date.now(),
    };
    setFamilyData(dataWithTimestamp);
    try {
      localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
    syncToCloud(dataWithTimestamp);
  };

  const setTargetGPA = (gpa: number) => {
    const rounded = Number(gpa.toFixed(2));
    setTargetGPAState(rounded);
    localStorage.setItem(TARGET_GPA_STORAGE_KEY, rounded.toString());
  };

  // 활성 자녀 객체
  const activeChild = useMemo(() => {
    return (
      familyData.children.find((c) => c.id === familyData.activeChildId) ||
      familyData.children[0] ||
      INITIAL_FAMILY_DATA.children[0]
    );
  }, [familyData]);

  // 자녀 전환
  const switchChild = (childId: string) => {
    saveFamilyData({
      ...familyData,
      activeChildId: childId,
    });
  };

  const updateChildName = (childId: string, name: string) => {
    saveFamilyData({
      ...familyData,
      children: familyData.children.map((c) =>
        c.id === childId ? { ...c, name } : c
      ),
    });
  };

  const updateTargetField = (childId: string, field: string) => {
    saveFamilyData({
      ...familyData,
      children: familyData.children.map((c) =>
        c.id === childId ? { ...c, targetMajorField: field } : c
      ),
    });
  };

  // 단일 과목 추가 (함수형 업데이트로 완벽 보장)
  const addCourse = (childId: string, course: SemesterCourseGrade) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const existingCourses = child.courses.filter((c) => c.id !== course.id);
          return {
            ...child,
            courses: [...existingCourses, course],
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 단일 과목 수정
  const updateCourse = (childId: string, course: SemesterCourseGrade) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const updatedCourses = child.courses.map((c) => (c.id === course.id ? course : c));
          return {
            ...child,
            courses: updatedCourses,
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 여러 과목 일괄 수정/추가 (마법봉 일괄 채우기 등)
  const updateMultipleCourses = (childId: string, newCourses: SemesterCourseGrade[]) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          // 기존 과목 맵 구성
          const courseMap = new Map(child.courses.map((c) => [c.id, c]));
          newCourses.forEach((nc) => {
            courseMap.set(nc.id, nc);
          });
          return {
            ...child,
            courses: Array.from(courseMap.values()),
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 과목 삭제
  const deleteCourse = (childId: string, courseId: string) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            courses: child.courses.filter((c) => c.id !== courseId),
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 모의고사 추가
  const addMockExam = (childId: string, exam: MockExamRecord) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const existingExams = child.mockExams ? child.mockExams.filter((e) => e.id !== exam.id) : [];
          return {
            ...child,
            mockExams: [...existingExams, exam],
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 모의고사 수정
  const updateMockExam = (childId: string, exam: MockExamRecord) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const existingExams = child.mockExams || [];
          const updated = existingExams.map((e) => (e.id === exam.id ? exam : e));
          return {
            ...child,
            mockExams: updated,
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 모의고사 삭제
  const deleteMockExam = (childId: string, examId: string) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            mockExams: (child.mockExams || []).filter((e) => e.id !== examId),
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 목표 대학 추가
  const addTargetUniversity = (childId: string, target: TargetUniversity) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const existingTargets = (child.targetUniversities || []).filter((t) => t.id !== target.id);
          return {
            ...child,
            targetUniversities: [...existingTargets, target],
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 목표 대학 수정
  const updateTargetUniversity = (childId: string, target: TargetUniversity) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          const existingTargets = child.targetUniversities || [];
          const updated = existingTargets.map((t) => (t.id === target.id ? target : t));
          return {
            ...child,
            targetUniversities: updated,
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 목표 대학 삭제
  const deleteTargetUniversity = (childId: string, targetId: string) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            targetUniversities: (child.targetUniversities || []).filter((t) => t.id !== targetId),
          };
        }
        return child;
      });
      const nextData: FamilyAppData = { ...prev, children: updatedChildren, updatedAt: Date.now() };
      try {
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) { console.error(e); }
      syncToCloud(nextData);
      return nextData;
    });
  };

  // 2028 5등급제 가중평균 환산
  const calculateCumulativeGPA = (courses: SemesterCourseGrade[]): number => {
    return calculateWeightedGPA(courses);
  };

  // D-Day 계산 유틸리티
  const calculateDDay = (targetDateStr: string): number => {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // JSON 백업 파일 다운로드 (내보내기)
  const exportDataAsJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(familyData, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `2028_대입전략_가족데이터_백업_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to export JSON data', e);
      alert('데이터 내보내기 중 오류가 발생했습니다.');
    }
  };

  // JSON 백업 파일 불러오기 (복원)
  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as FamilyAppData;
      if (!parsed.children || !Array.isArray(parsed.children) || parsed.children.length === 0) {
        alert('올바르지 않은 대입 전략 데이터 파일 형식입니다.');
        return false;
      }
      saveFamilyData(parsed);
      alert('가족 대입 전략 데이터가 성공적으로 복원되었습니다! 🎉');
      return true;
    } catch (e) {
      console.error('Failed to import JSON data', e);
      alert('파일을 읽는 도중 오류가 발생했습니다. 올바른 JSON 파일인지 확인해 주세요.');
      return false;
    }
  };

  const resetToInitialData = () => {
    saveFamilyData(INITIAL_FAMILY_DATA);
    setTargetGPA(1.15);
  };

  return (
    <AdmissionsContext.Provider
      value={{
        childrenList: familyData.children,
        activeChildId: familyData.activeChildId,
        activeChild,
        activeTab,
        setActiveTab,
        targetGPA,
        setTargetGPA,
        switchChild,
        updateChildName,
        updateTargetField,
        addCourse,
        updateCourse,
        updateMultipleCourses,
        deleteCourse,
        addMockExam,
        updateMockExam,
        deleteMockExam,
        addTargetUniversity,
        updateTargetUniversity,
        deleteTargetUniversity,
        calculateCumulativeGPA,
        calculateDDay,
        exportDataAsJSON,
        importDataFromJSON,
        resetToInitialData,
      }}
    >
      {children}
    </AdmissionsContext.Provider>
  );
}

export function useAdmissions() {
  const context = useContext(AdmissionsContext);
  if (!context) {
    throw new Error('useAdmissions must be used within an AdmissionsProvider');
  }
  return context;
}
