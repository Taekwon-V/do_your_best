'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChildProfile, SemesterCourseGrade, FamilyAppData } from '@/types/admissions';
import { INITIAL_FAMILY_DATA } from '@/data/initialData';

interface AdmissionsContextType {
  childrenList: ChildProfile[];
  activeChildId: string;
  activeChild: ChildProfile;
  switchChild: (childId: string) => void;
  updateChildName: (childId: string, name: string) => void;
  updateTargetField: (childId: string, field: string) => void;
  calculateCumulativeGPA: (courses: SemesterCourseGrade[]) => number;
  calculateDDay: (targetDateStr: string) => number;
  resetToInitialData: () => void;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

const FAMILY_DATA_STORAGE_KEY = 'admission_app_family_data';

export function AdmissionsProvider({ children }: { children: React.ReactNode }) {
  const [familyData, setFamilyData] = useState<FamilyAppData>(INITIAL_FAMILY_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAMILY_DATA_STORAGE_KEY);
      if (saved) {
        setFamilyData(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load admissions data from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveFamilyData = (newData: FamilyAppData) => {
    setFamilyData(newData);
    localStorage.setItem(FAMILY_DATA_STORAGE_KEY, JSON.stringify(newData));
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

  // 2028 5등급제 가중평균 환산 (단위수 × 석차등급 합 / 총 단위수)
  const calculateCumulativeGPA = (courses: SemesterCourseGrade[]): number => {
    if (!courses || courses.length === 0) return 0;
    const completedCourses = courses.filter((c) => !c.isSimulated);
    if (completedCourses.length === 0) return 0;

    let totalUnits = 0;
    let weightedSum = 0;

    for (const c of completedCourses) {
      if (c.rankGrade && c.unitCount) {
        totalUnits += c.unitCount;
        weightedSum += c.unitCount * c.rankGrade;
      }
    }

    if (totalUnits === 0) return 0;
    return Number((weightedSum / totalUnits).toFixed(2));
  };

  // D-Day 계산 유틸리티
  const calculateDDay = (targetDateStr: string): number => {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const resetToInitialData = () => {
    saveFamilyData(INITIAL_FAMILY_DATA);
  };

  return (
    <AdmissionsContext.Provider
      value={{
        childrenList: familyData.children,
        activeChildId: familyData.activeChildId,
        activeChild,
        switchChild,
        updateChildName,
        updateTargetField,
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
