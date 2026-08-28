'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChildProfile, SemesterCourseGrade, FamilyAppData, MockExamRecord, MainTabKey, TargetUniversity } from '@/types/admissions';
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
  const [familyData, setFamilyData] = useState<FamilyAppData>(INITIAL_FAMILY_DATA);
  const [targetGPA, setTargetGPAState] = useState<number>(1.15);
  const [activeTab, setActiveTabState] = useState<MainTabKey>('home');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 초기 로컬스토리지 데이터 로드
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
      if (savedData) {
        setFamilyData(JSON.parse(savedData));
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

  // 2. Cloud Firestore 실시간 리스너 연결 (가족 간 기기 자동 동기화)
  useEffect(() => {
    if (!db) return;
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      const unsubscribe = onSnapshot(familyDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as FamilyAppData;
          if (cloudData && cloudData.children && cloudData.children.length > 0) {
            setFamilyData(cloudData);
            localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
          }
        }
      }, (error) => {
        console.warn('Firestore sync listener notice (offline fallback active):', error.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }, []);

  const setActiveTab = (tab: MainTabKey) => {
    setActiveTabState(tab);
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab);
  };

  // 로컬 & 클라우드 동시 영속화
  const saveFamilyData = (newData: FamilyAppData) => {
    setFamilyData(newData);
    localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(newData));

    // Firestore 클라우드 백업 (온라인 시 실시간 반영)
    if (db) {
      try {
        const familyDocRef = doc(db, 'families', 'our-happy-family');
        setDoc(familyDocRef, newData, { merge: true }).catch((err) => {
          console.warn('Firestore cloud sync notice:', err.message);
        });
      } catch (err) {
        console.warn('Cloud sync error:', err);
      }
    }
  };

  const setTargetGPA = (gpa: number) => {
    const rounded = Number(gpa.toFixed(2));
    setTargetGPAState(rounded);
    localStorage.setItem(TARGET_GPA_STORAGE_KEY, rounded.toString());
  };

  const activeChild = useMemo(() => {
    return (
      familyData.children.find((c) => c.id === familyData.activeChildId) ||
      familyData.children[0]
    );
  }, [familyData]);

  const switchChild = (childId: string) => {
    saveFamilyData({
      ...familyData,
      activeChildId: childId,
    });
  };

  const updateChildName = (childId: string, name: string) => {
    const updated = familyData.children.map((c) =>
      c.id === childId ? { ...c, name } : c
    );
    saveFamilyData({
      ...familyData,
      children: updated,
    });
  };

  const updateTargetField = (childId: string, field: string) => {
    const updated = familyData.children.map((c) =>
      c.id === childId ? { ...c, targetMajorField: field } : c
    );
    saveFamilyData({
      ...familyData,
      children: updated,
    });
  };

  // 과목 추가
  const addCourse = (childId: string, course: SemesterCourseGrade) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          courses: [...child.courses, course],
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 과목 수정
  const updateCourse = (childId: string, course: SemesterCourseGrade) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const updatedCourses = child.courses.map((c) => (c.id === course.id ? course : c));
        return {
          ...child,
          courses: updatedCourses,
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 과목 삭제
  const deleteCourse = (childId: string, courseId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const updatedCourses = child.courses.filter((c) => c.id !== courseId);
        return {
          ...child,
          courses: updatedCourses,
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 모의고사 추가
  const addMockExam = (childId: string, exam: MockExamRecord) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const existingExams = child.mockExams || [];
        return {
          ...child,
          mockExams: [...existingExams, exam],
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 모의고사 수정
  const updateMockExam = (childId: string, exam: MockExamRecord) => {
    const updatedChildren = familyData.children.map((child) => {
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
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 모의고사 삭제
  const deleteMockExam = (childId: string, examId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const existingExams = child.mockExams || [];
        const updated = existingExams.filter((e) => e.id !== examId);
        return {
          ...child,
          mockExams: updated,
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 목표 대학 추가
  const addTargetUniversity = (childId: string, target: TargetUniversity) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const existingTargets = child.targetUniversities || [];
        return {
          ...child,
          targetUniversities: [...existingTargets, target],
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 목표 대학 수정
  const updateTargetUniversity = (childId: string, target: TargetUniversity) => {
    const updatedChildren = familyData.children.map((child) => {
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
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 목표 대학 삭제
  const deleteTargetUniversity = (childId: string, targetId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const existingTargets = child.targetUniversities || [];
        const updated = existingTargets.filter((t) => t.id !== targetId);
        return {
          ...child,
          targetUniversities: updated,
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
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
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(familyData, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `2028_대입전략_가족데이터_백업_${dateStr}.json`);
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
