'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChildProfile, SemesterCourseGrade, FamilyAppData, MockExamRecord, MainTabKey, TargetUniversity } from '@/types/admissions';
import { INITIAL_FAMILY_DATA } from '@/data/initialData';
import { calculateWeightedGPA } from '@/utils/gpaCalculator';

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

  const setActiveTab = (tab: MainTabKey) => {
    setActiveTabState(tab);
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab);
  };

  const saveFamilyData = (newData: FamilyAppData) => {
    setFamilyData(newData);
    localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(newData));
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
