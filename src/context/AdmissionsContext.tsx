'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  // Cloud sync status
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  forceSyncCloud: () => Promise<void>;
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
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('offline');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // 1. 초기 로컬스토리지 복구 (타겟 GPA)
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
    } catch (e) {
      console.error('Failed to load admissions data from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 클라우드 백업 전송 헬퍼 (Promise 반환)
  const syncToCloud = useCallback(async (data: FamilyAppData) => {
    if (!db) return;
    setSyncStatus('syncing');
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      await setDoc(familyDocRef, data, { merge: true });
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err: any) {
      console.warn('Firestore cloud sync notice:', err?.message || err);
      setSyncStatus('error');
    }
  }, []);

  // 2. Cloud Firestore 실시간 리스너 및 로그인 시 강제 동기화
  useEffect(() => {
    if (!db) return;

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSyncStatus('syncing');
        try {
          const familyDocRef = doc(db, 'families', 'our-happy-family');
          
          // 1차 getDoc으로 클라우드 최신 데이터 즉시 가져오기
          const docSnap = await getDoc(familyDocRef);
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as FamilyAppData;
            if (cloudData && cloudData.children && cloudData.children.length > 0) {
              const localSaved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
              const localData: FamilyAppData | null = localSaved ? JSON.parse(localSaved) : null;
              
              const localHasData = (localData?.children || []).some(
                (c) => (c.courses?.length || 0) > 0 || (c.mockExams?.length || 0) > 0 || (c.targetUniversities?.length || 0) > 0
              );
              const cloudHasData = (cloudData.children || []).some(
                (c) => (c.courses?.length || 0) > 0 || (c.mockExams?.length || 0) > 0 || (c.targetUniversities?.length || 0) > 0
              );

              const localTimestamp = localData?.updatedAt || 0;
              const cloudTimestamp = cloudData.updatedAt || 0;

              // 클라우드에 실 데이터가 있거나 클라우드가 더 최신인 경우 클라우드 채택
              if (cloudHasData || cloudTimestamp >= localTimestamp || !localHasData) {
                setFamilyData(cloudData);
                localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
              } else if (localHasData && localTimestamp > cloudTimestamp) {
                // 로컬 데이터가 더 최신인 경우 클라우드로 업로드
                await syncToCloud(localData!);
              }
            }
          } else {
            // 클라우드 문서가 아직 없다면 현재 로컬 데이터를 클라우드에 최초 업로드
            const currentLocal = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
            if (currentLocal) {
              const parsed = JSON.parse(currentLocal);
              await syncToCloud(parsed);
            } else {
              await syncToCloud(INITIAL_FAMILY_DATA);
            }
          }

          setSyncStatus('synced');
          setLastSyncedAt(new Date());

          // 2차 onSnapshot 실시간 동기화 연결
          if (unsubscribeSnapshot) unsubscribeSnapshot();
          unsubscribeSnapshot = onSnapshot(
            familyDocRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const updatedCloudData = snapshot.data() as FamilyAppData;
                if (updatedCloudData && updatedCloudData.children && updatedCloudData.children.length > 0) {
                  setFamilyData(updatedCloudData);
                  localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(updatedCloudData));
                  setSyncStatus('synced');
                  setLastSyncedAt(new Date());
                }
              }
            },
            (error) => {
              console.warn('Firestore snapshot listener notice:', error.message);
              setSyncStatus('error');
            }
          );
        } catch (e: any) {
          console.warn('Firestore sync init error:', e?.message || e);
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('offline');
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [syncToCloud]);

  // 수동 강제 동기화 함수
  const forceSyncCloud = useCallback(async () => {
    if (!db || !auth.currentUser) {
      alert('구글 계정으로 로그인 후 동기화를 진행해 주세요.');
      return;
    }
    setSyncStatus('syncing');
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      const docSnap = await getDoc(familyDocRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as FamilyAppData;
        if (cloudData && cloudData.children) {
          setFamilyData(cloudData);
          localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          alert('클라우드로부터 가족 최신 데이터를 성공적으로 불러왔습니다! ☁️✨');
          return;
        }
      }
      // 클라우드에 없다면 현재 로컬 데이터 업로드
      await syncToCloud(familyData);
      alert('현재 로컬 데이터를 가족 클라우드에 성공적으로 백업했습니다! ☁️✨');
    } catch (e: any) {
      alert(`클라우드 동기화 실패: ${e?.message || '권한 또는 네트워크 오류'}`);
      setSyncStatus('error');
    }
  }, [familyData, syncToCloud]);

  const setActiveTab = (tab: MainTabKey) => {
    setActiveTabState(tab);
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

  // 단일 과목 추가
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

  // 여러 과목 일괄 수정/추가
  const updateMultipleCourses = (childId: string, newCourses: SemesterCourseGrade[]) => {
    setFamilyData((prev) => {
      const updatedChildren = prev.children.map((child) => {
        if (child.id === childId) {
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
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `admission_strategy_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to export data', e);
      alert('데이터 내보내기에 실패했습니다.');
    }
  };

  // JSON 백업 파일 복원 (가져오기)
  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.children) && parsed.children.length > 0) {
        saveFamilyData(parsed);
        alert('데이터가 성공적으로 복원 및 클라우드 동기화되었습니다!');
        return true;
      } else {
        alert('유효하지 않은 백업 파일 형식입니다.');
        return false;
      }
    } catch (e) {
      console.error('Failed to import data', e);
      alert('파일을 읽는 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 초기화 함수
  const resetToInitialData = () => {
    if (confirm('모든 성적과 목표 대학 데이터를 초기화하시겠습니까?')) {
      saveFamilyData(INITIAL_FAMILY_DATA);
    }
  };

  const contextValue: AdmissionsContextType = {
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
    syncStatus,
    lastSyncedAt,
    forceSyncCloud,
  };

  return (
    <AdmissionsContext.Provider value={contextValue}>
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
