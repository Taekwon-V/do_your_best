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
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  forceSyncCloud: () => Promise<void>;
  pushLocalToCloud: () => Promise<{ success: boolean; message: string }>;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

const FAMILY_DATA_STORAGE_KEY = 'admission_app_family_data_v3';
const TARGET_GPA_STORAGE_KEY = 'admission_app_target_gpa';

export function AdmissionsProvider({ children }: { children: React.ReactNode }) {
  const [familyData, setFamilyData] = useState<FamilyAppData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.children) && parsed.children.length > 0) {
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
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // 1. 초기 로컬스토리지 복구
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && Array.isArray(parsed.children) && parsed.children.length > 0) {
          setFamilyData(parsed);
        } else {
          setFamilyData(INITIAL_FAMILY_DATA);
          localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(INITIAL_FAMILY_DATA));
        }
      } else {
        setFamilyData(INITIAL_FAMILY_DATA);
        localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(INITIAL_FAMILY_DATA));
      }
      const savedTarget = localStorage.getItem(TARGET_GPA_STORAGE_KEY);
      if (savedTarget) {
        setTargetGPAState(parseFloat(savedTarget));
      }
    } catch (e) {
      console.error('Failed to load admissions data from storage', e);
    }
  }, []);

  // 클라우드 백업 전송 헬퍼
  const syncToCloud = useCallback(async (data: FamilyAppData) => {
    if (!db) return;
    try {
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      await setDoc(familyDocRef, data, { merge: true });
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err: any) {
      console.warn('Cloud sync notice:', err?.message || err);
    }
  }, []);

  // 2. Cloud Firestore 실시간 리스너
  useEffect(() => {
    if (!db) return;

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const familyDocRef = doc(db, 'families', 'our-happy-family');
          
          const docSnap = await getDoc(familyDocRef);
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as FamilyAppData;
            if (cloudData && Array.isArray(cloudData.children) && cloudData.children.length > 0) {
              setFamilyData(cloudData);
              localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
            }
          } else {
            // 클라우드에 아직 없으면 로컬 데이터 최초 업로드
            const localSaved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
            const currentData = localSaved ? JSON.parse(localSaved) : INITIAL_FAMILY_DATA;
            await syncToCloud(currentData);
          }

          setSyncStatus('synced');
          setLastSyncedAt(new Date());

          if (unsubscribeSnapshot) unsubscribeSnapshot();
          unsubscribeSnapshot = onSnapshot(
            familyDocRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const updatedCloudData = snapshot.data() as FamilyAppData;
                if (updatedCloudData && Array.isArray(updatedCloudData.children) && updatedCloudData.children.length > 0) {
                  setFamilyData(updatedCloudData);
                  localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(updatedCloudData));
                  setSyncStatus('synced');
                  setLastSyncedAt(new Date());
                }
              }
            },
            (error) => {
              console.warn('Firestore listener notice:', error.message);
            }
          );
        } catch (e: any) {
          console.warn('Firestore sync notice:', e?.message || e);
        }
      } else {
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

  // 수동 강제 동기화 (풀/가져오기) 함수
  const forceSyncCloud = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      if (db) {
        const familyDocRef = doc(db, 'families', 'our-happy-family');
        const docSnap = await getDoc(familyDocRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as FamilyAppData;
          if (cloudData && Array.isArray(cloudData.children)) {
            setFamilyData(cloudData);
            localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(cloudData));
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
            return;
          }
        }
        await syncToCloud(familyData);
      }
      setSyncStatus('synced');
    } catch (e: any) {
      console.warn('Sync notice:', e);
      setSyncStatus('synced');
    }
  }, [familyData, syncToCloud]);

  // ⚡ 현재 내 화면의 모든 데이터를 클라우드 서버에 직접 푸시(덮어쓰기)하는 강력한 전체 동기화 함수
  const pushLocalToCloud = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setSyncStatus('syncing');
    try {
      if (!db) {
        throw new Error('Firebase DB가 설정되지 않았습니다.');
      }
      const familyDocRef = doc(db, 'families', 'our-happy-family');
      const dataWithTimestamp: FamilyAppData = {
        ...familyData,
        updatedAt: Date.now(),
      };
      await setDoc(familyDocRef, dataWithTimestamp, { merge: true });
      localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(dataWithTimestamp));
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      return {
        success: true,
        message: '현재 화면의 모든 입시 데이터(수시 6장 포트폴리오, 모의고사, 내신 성적 등)가 클라우드 서버에 성공적으로 전송되었습니다!\n\n이제 아내분과 가족 기기에서 앱을 새로고침하시면 100% 동일하게 반영됩니다.',
      };
    } catch (err: any) {
      setSyncStatus('error');
      console.error('Push to cloud failed:', err);
      return {
        success: false,
        message: `클라우드 전송 실패: ${err?.message || err}\n\nFirebase Console에서 Firestore 보안 규칙(Rules)이 허용되어 있는지 확인해 주세요.`,
      };
    }
  }, [familyData]);

  const setActiveTab = (tab: MainTabKey) => {
    setActiveTabState(tab);
  };

  // 로컬 & 클라우드 동시 영속화 함수
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

  // 활성 자녀 객체 (안전한 기본값 보장)
  const activeChild = useMemo(() => {
    const found = familyData?.children?.find((c) => c.id === familyData.activeChildId);
    if (found) {
      return {
        ...found,
        courses: found.courses || [],
        mockExams: found.mockExams || [],
        targetUniversities: found.targetUniversities || [],
      };
    }
    return {
      ...INITIAL_FAMILY_DATA.children[0],
      courses: INITIAL_FAMILY_DATA.children[0].courses || [],
      mockExams: INITIAL_FAMILY_DATA.children[0].mockExams || [],
      targetUniversities: INITIAL_FAMILY_DATA.children[0].targetUniversities || [],
    };
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
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const existingCourses = (child.courses || []).filter((c) => c.id !== course.id);
        return {
          ...child,
          courses: [...existingCourses, course],
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 단일 과목 수정
  const updateCourse = (childId: string, course: SemesterCourseGrade) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const updatedCourses = (child.courses || []).map((c) => (c.id === course.id ? course : c));
        return {
          ...child,
          courses: updatedCourses,
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 여러 과목 일괄 수정/추가
  const updateMultipleCourses = (childId: string, newCourses: SemesterCourseGrade[]) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        const courseMap = new Map((child.courses || []).map((c) => [c.id, c]));
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
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 과목 삭제
  const deleteCourse = (childId: string, courseId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          courses: (child.courses || []).filter((c) => c.id !== courseId),
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
        const existingExams = (child.mockExams || []).filter((e) => e.id !== exam.id);
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

  // 모의고사 삭제 (안전하게 100% 영속화)
  const deleteMockExam = (childId: string, examId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          mockExams: (child.mockExams || []).filter((e) => e.id !== examId),
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
        const existingTargets = (child.targetUniversities || []).filter((t) => t.id !== target.id);
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

  // 목표 대학 삭제 (안전하게 100% 영속화)
  const deleteTargetUniversity = (childId: string, targetId: string) => {
    const updatedChildren = familyData.children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          targetUniversities: (child.targetUniversities || []).filter((t) => t.id !== targetId),
        };
      }
      return child;
    });
    saveFamilyData({ ...familyData, children: updatedChildren });
  };

  // 2028 5등급제 가중평균 환산
  const calculateCumulativeGPA = (courses: SemesterCourseGrade[]): number => {
    return calculateWeightedGPA(courses || []);
  };

  // D-Day 계산 유틸리티
  const calculateDDay = (targetDateStr: string): number => {
    if (!targetDateStr) return 0;
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // JSON 백업 파일 다운로드
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

  // JSON 백업 파일 복원
  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.children) && parsed.children.length > 0) {
        saveFamilyData(parsed);
        alert('데이터가 성공적으로 복원되었습니다!');
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
    saveFamilyData(INITIAL_FAMILY_DATA);
  };

  const contextValue: AdmissionsContextType = {
    childrenList: familyData.children || [],
    activeChildId: familyData.activeChildId || INITIAL_FAMILY_DATA.activeChildId,
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
    pushLocalToCloud,
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
