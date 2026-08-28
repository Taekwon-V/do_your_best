export type AdmissionYear = 2028 | 2029;
export type GradeLevel = 1 | 2;
export type SemesterKey = '1-1' | '1-2' | '2-1' | '2-2' | '3-1';
export type MainTabKey = 'home' | 'susi' | 'jeongsi' | 'targets' | 'reports';

export type SubjectCategory =
  | '국어'
  | '수학'
  | '영어'
  | '사회'
  | '과학'
  | '한국사'
  | '기술가정/정보'
  | '제2외국어/한문'
  | '기타';

export type RankGrade5 = 1 | 2 | 3 | 4 | 5;
export type AchievementLevel = 'A' | 'B' | 'C' | 'D' | 'E';

export interface SemesterCourseGrade {
  id: string;
  semester: SemesterKey;
  isSimulated?: boolean;
  category: SubjectCategory;
  courseName: string;
  unitCount: number; // 단위수 (e.g. 4)
  rankGrade: number; // 석차등급 (1 ~ 5)
  achievement: AchievementLevel;
  rawScore?: number;
  classAverage?: number;
}

export interface MockExamScoreSubject {
  standardScore?: number;
  percentile?: number;
  grade: number;
}

export interface MockExamRecord {
  id: string;
  gradeLevel: 1 | 2 | 3;
  examMonth: 3 | 5 | 6 | 7 | 9 | 10 | 11;
  examName: string;
  examDate: string;
  scores: {
    korean: MockExamScoreSubject;
    math: MockExamScoreSubject;
    english: { rawScore?: number; grade: number };
    koreanHistory: { rawScore?: number; grade: number };
    integratedSocial: MockExamScoreSubject;
    integratedScience: MockExamScoreSubject;
  };
}

export type SusiCategory = 'safe' | 'target' | 'reach'; // 안정, 적정, 소신
export type JeongsiGroup = 'ga' | 'na' | 'da';

export interface TargetUniversity {
  id: string;
  type: 'susi' | 'jeongsi';
  susiCategory?: SusiCategory;
  jeongsiGroup?: JeongsiGroup;
  universityName: string;
  departmentName: string;
  admissionType: '교과' | '종합' | '논술' | '수능위주';
  susiRequirements?: {
    subjectWeight?: Record<string, number>;
    gradeWeight?: { 1: number; 2: number; 3: number };
    expectedCutoffGrade?: number;
    minimumCsatRequirement?: {
      description: string;
      requiredSubjectsCount: number;
      sumGradeLimit: number;
    };
  };
  jeongsiRequirements?: {
    convertedStandardScoreCutoff?: number;
    percentileCutoff?: number;
    subjectWeights: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      history: number;
    };
  };
}

export interface DDayMilestone {
  title: string;
  targetDate: string;
  tag: '내신' | '모의고사' | '수능' | '수시원서';
  isImportant?: boolean;
}

export interface ChildProfile {
  id: string; // 'child-1-go2' | 'child-2-go1'
  name: string; // '고2 아들' | '고1 딸'
  currentGrade: GradeLevel;
  targetAdmissionYear: AdmissionYear;
  targetMajorField: string;
  completedSemesters: SemesterKey[];
  dDayMilestones: DDayMilestone[];
  courses: SemesterCourseGrade[];
  mockExams: MockExamRecord[];
  targetUniversities: TargetUniversity[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isAllowedFamily: boolean;
}

export interface FamilyAppData {
  familyId: string;
  activeChildId: string;
  allowedEmails: string[];
  children: ChildProfile[];
}
