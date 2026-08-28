import { SusiCategory, JeongsiGroup } from '@/types/admissions';

export interface DepartmentAdmissionData {
  deptName: string;
  collegeName: string; // 단과대학명
  susiGyogwa?: {
    expectedCut5: number;
    minCsatDesc: string;
    requiredSubjectsCount: number;
    sumGradeLimit: number;
    susiCategory: SusiCategory;
    admissionType: '교과';
  };
  susiJonghap?: {
    expectedCut5: number;
    minCsatDesc: string;
    requiredSubjectsCount: number;
    sumGradeLimit: number;
    susiCategory: SusiCategory;
    typeName: string; // 예: "인하미래인재", "자기추천", "CAU융합형"
    admissionType: '종합';
  };
  jeongsi?: {
    group: JeongsiGroup;
    percentileCut: number;
    subjectWeights: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      history: number;
    };
  };
}

export interface UniversityData {
  univId: string;
  univName: string;
  shortName: string;
  badge: string;
  departments: DepartmentAdmissionData[];
}

export const UNIVERSITY_ADMISSIONS_DB: UniversityData[] = [
  // ==========================================
  // 1. 인하대학교 (INHA UNIVERSITY)
  // ==========================================
  {
    univId: 'inha',
    univName: '인하대학교',
    shortName: '인하대',
    badge: '인천 명문사립 🏫',
    departments: [
      // 사범대학
      {
        deptName: '수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.54, minCsatDesc: '수능최저학력기준 없음 (서류 70% + 면접 30%)', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 85.0, subjectWeights: { korean: 25, math: 40, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '국어교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.60, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 84.0, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '영어교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.65, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 83.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '사회교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.70, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 83.0, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '교육학과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.72, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 83.0, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },

      // 소프트웨어융합 / AI대학
      {
        deptName: '컴퓨터공학과',
        collegeName: '소프트웨어융합대학',
        susiGyogwa: { expectedCut5: 1.44, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.63, minCsatDesc: '수능최저학력기준 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 84.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '인공지능공학과',
        collegeName: '소프트웨어융합대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.58, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 85.2, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '데이터사이언스학과',
        collegeName: '소프트웨어융합대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.62, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 84.8, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '스마트모빌리티공학과',
        collegeName: '소프트웨어융합대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.66, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 84.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },

      // 자연과학대학
      {
        deptName: '수학과 [교직이수]',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.76, minCsatDesc: '수능최저 없음 (교직과정 개설)', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 84.0, subjectWeights: { korean: 25, math: 40, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '통계학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.34, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.67, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 84.2, subjectWeights: { korean: 25, math: 40, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '화학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.34, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.65, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 83.8, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '생명과학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.50, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 84.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },

      // 공과대학
      {
        deptName: '전기전자공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.56, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 85.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '반도체시스템공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.54, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 86.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '화학공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.42, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 85.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '생명공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.33, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.45, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 85.2, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '기계공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.57, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 84.8, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '항공우주공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.44, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.63, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 85.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '신소재공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.61, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 84.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },

      // 경영대학 / 사회과학대학
      {
        deptName: '경영학과',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.74, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 84.0, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '아태물류학부',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.40, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.62, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 85.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '글로벌금융학과',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.41, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.68, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 84.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '미디어커뮤니케이션학과',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.41, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.58, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 84.2, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '행정학과',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.75, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 83.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '정치외교학과',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.74, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 83.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },
      {
        deptName: '경제학과',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.46, minCsatDesc: '국수영탐(1) 중 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.76, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 83.5, subjectWeights: { korean: 35, math: 25, inquiry: 25, english: 15, history: 0 } },
      },

      // 의예과
      {
        deptName: '의예과',
        collegeName: '의과대학',
        susiGyogwa: { expectedCut5: 1.00, minCsatDesc: '국수영과(2) 중 3개 1등급', requiredSubjectsCount: 3, sumGradeLimit: 3, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.05, minCsatDesc: '국수영과(2) 중 3개 1등급', requiredSubjectsCount: 3, sumGradeLimit: 3, susiCategory: 'reach', typeName: '인하미래인재', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 98.8, subjectWeights: { korean: 20, math: 40, inquiry: 30, english: 10, history: 0 } },
      },
    ],
  },

  // ==========================================
  // 2. 국립인천대학교 (INCHEON NATIONAL UNIVERSITY)
  // ==========================================
  {
    univId: 'incheon',
    univName: '국립인천대학교',
    shortName: '인천대',
    badge: '인천 거점국립 🏛️',
    departments: [
      // 사범대학
      {
        deptName: '수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.48, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.64, minCsatDesc: '수능최저 없음 (서류 70% + 면접 30%)', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 80.3, subjectWeights: { korean: 25, math: 40, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '국어교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.54, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.68, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 79.8, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '영어교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.58, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.70, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 79.5, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '역사교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.60, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.72, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 79.0, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '유아교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.67, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.90, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.5, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '일어교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.83, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.91, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 77.8, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },

      // 공과대학 / 정보기술대학
      {
        deptName: '컴퓨터공학부',
        collegeName: '정보기술대학',
        susiGyogwa: { expectedCut5: 1.71, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.86, minCsatDesc: '수능최저학력기준 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 79.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '정보통신공학과',
        collegeName: '정보기술대학',
        susiGyogwa: { expectedCut5: 1.78, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.95, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 78.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '임베디드시스템공학과',
        collegeName: '정보기술대학',
        susiGyogwa: { expectedCut5: 1.84, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.98, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '전자공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.58, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.78, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 79.0, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '전기공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.66, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.85, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 78.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '기계공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.64, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.83, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 78.8, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '에너지화학공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.51, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.72, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 79.2, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '신소재공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.59, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.80, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.2, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '안전공학과',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.80, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.95, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 77.5, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },

      // 자연과학대학 / 생명공학
      {
        deptName: '수학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.68, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.92, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.0, subjectWeights: { korean: 25, math: 40, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '화학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.59, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.82, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 78.2, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },
      {
        deptName: '생명과학부',
        collegeName: '생명과학기술대학',
        susiGyogwa: { expectedCut5: 1.55, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.75, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.8, subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 } },
      },

      // 경영대학 / 사회과학대학
      {
        deptName: '경영학부',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.62, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.80, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 78.5, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '경제학과',
        collegeName: '정경대학',
        susiGyogwa: { expectedCut5: 1.71, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.88, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.0, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '행정학과',
        collegeName: '정경대학',
        susiGyogwa: { expectedCut5: 1.71, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.87, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 78.2, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '정치외교학과',
        collegeName: '정경대학',
        susiGyogwa: { expectedCut5: 1.79, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'safe', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.90, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 77.8, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
      {
        deptName: '미디어커뮤니케이션학과',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.63, minCsatDesc: '국수영탐(1) 중 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7, susiCategory: 'target', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.78, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'safe', typeName: '자기추천', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 78.5, subjectWeights: { korean: 35, math: 30, inquiry: 25, english: 10, history: 0 } },
      },
    ],
  },

  // ==========================================
  // 3. 중앙대학교 (CHUNG-ANG UNIVERSITY - 서울)
  // ==========================================
  {
    univId: 'cau',
    univName: '중앙대학교',
    shortName: '중앙대',
    badge: '서울 주요대 🌟',
    departments: [
      {
        deptName: '소프트웨어학부',
        collegeName: '소프트웨어대학',
        susiGyogwa: { expectedCut5: 1.25, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.28, minCsatDesc: '수능최저학력기준 없음 (서류 100% + 면접)', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 91.5, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: 'AI학과',
        collegeName: '소프트웨어대학',
        susiGyogwa: { expectedCut5: 1.23, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.27, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 92.0, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: '전자전기공학부',
        collegeName: '창의ICT공과대학',
        susiGyogwa: { expectedCut5: 1.21, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.29, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 91.0, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: '기계공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.26, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.34, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 90.5, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: '화학신소재공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.22, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.30, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 91.2, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: '수학과',
        collegeName: '자연과학대학',
        susiGyogwa: { expectedCut5: 1.28, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.38, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'target', typeName: 'CAU탐구형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 90.0, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
      {
        deptName: '경영학부',
        collegeName: '경영경제대학',
        susiGyogwa: { expectedCut5: 1.29, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.35, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'da', percentileCut: 90.0, subjectWeights: { korean: 35, math: 40, inquiry: 25, english: 0, history: 0 } },
      },
      {
        deptName: '미디어커뮤니케이션학부',
        collegeName: '사회과학대학',
        susiGyogwa: { expectedCut5: 1.27, minCsatDesc: '국수영탐(1) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.32, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 89.8, subjectWeights: { korean: 35, math: 35, inquiry: 30, english: 0, history: 0 } },
      },
      {
        deptName: '의예과',
        collegeName: '의과대학',
        susiGyogwa: { expectedCut5: 1.00, minCsatDesc: '국수영과(2) 4개 영역 합 5 이내', requiredSubjectsCount: 4, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.02, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: 'CAU융합형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 99.0, subjectWeights: { korean: 25, math: 40, inquiry: 35, english: 0, history: 0 } },
      },
    ],
  },

  // ==========================================
  // 4. 주요 상위 대학 (서울대 / 연세대 / 고려대)
  // ==========================================
  {
    univId: 'sky',
    univName: '주요 상위권 대학 (SKY)',
    shortName: 'SKY',
    badge: '최상위권 🏆',
    departments: [
      {
        deptName: '서울대학교 컴퓨터공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.00, minCsatDesc: '국수영탐(2) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.05, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '일반전형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 98.0, subjectWeights: { korean: 33.3, math: 40, inquiry: 26.7, english: 0, history: 0 } },
      },
      {
        deptName: '서울대학교 수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.02, minCsatDesc: '국수영탐(2) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.08, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '일반전형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 97.0, subjectWeights: { korean: 33.3, math: 40, inquiry: 26.7, english: 0, history: 0 } },
      },
      {
        deptName: '연세대학교 인공지능학과',
        collegeName: '인공지능융합대학',
        susiGyogwa: { expectedCut5: 1.10, minCsatDesc: '국수 중 1개 포함 2개 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.18, minCsatDesc: '국수 중 1개 포함 2개 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', typeName: '활동우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 96.0, subjectWeights: { korean: 22.2, math: 44.4, inquiry: 33.3, english: 0, history: 0 } },
      },
      {
        deptName: '연세대학교 경영학과',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.12, minCsatDesc: '국수 중 1개 포함 2개 합 4 이내', requiredSubjectsCount: 2, sumGradeLimit: 4, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.16, minCsatDesc: '국수 중 1개 포함 2개 합 4 이내', requiredSubjectsCount: 2, sumGradeLimit: 4, susiCategory: 'reach', typeName: '활동우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 95.5, subjectWeights: { korean: 33.3, math: 33.3, inquiry: 33.3, english: 0, history: 0 } },
      },
      {
        deptName: '고려대학교 컴퓨터학과',
        collegeName: '정보대학',
        susiGyogwa: { expectedCut5: 1.12, minCsatDesc: '국수영탐 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.20, minCsatDesc: '국수영탐 4개 영역 합 8 이내', requiredSubjectsCount: 4, sumGradeLimit: 8, susiCategory: 'reach', typeName: '학업우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 96.0, subjectWeights: { korean: 31.25, math: 37.5, inquiry: 31.25, english: 0, history: 0 } },
      },
      {
        deptName: '고려대학교 수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.15, minCsatDesc: '국수영탐 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.24, minCsatDesc: '국수영탐 4개 영역 합 8 이내', requiredSubjectsCount: 4, sumGradeLimit: 8, susiCategory: 'reach', typeName: '학업우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 95.0, subjectWeights: { korean: 31.25, math: 37.5, inquiry: 31.25, english: 0, history: 0 } },
      },
    ],
  },
];
