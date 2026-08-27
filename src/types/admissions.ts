export type AdmissionYear = 2028 | 2029;
export type GradeLevel = 1 | 2;
export type SemesterKey = '1-1' | '1-2' | '2-1' | '2-2' | '3-1';

export type SubjectCategory =
  | '국어'
  | '수학'
  | '영어'
  | '사회'
  | '과학'
  | '한국사'
  | '기술가정'
  | '기타';

export interface SemesterCourseGrade {
  id: string;
  semester: SemesterKey;
  isSimulated?: boolean;
  category: SubjectCategory;
  courseName: string;
  unitCount: number; // 단위수 (e.g. 4)
  rankGrade: number; // 석차등급 (1 ~ 5)
  achievement: 'A' | 'B' | 'C' | 'D' | 'E';
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
  
  // 수시 기준
  susiRequirements?: {
    subjectWeight: { [category: string]: number };
    gradeWeight: { [grade: string]: number };
    expectedCutoffGrade: number; // 5등급제 환산 예상 컷 (예: 1.25)
    minimumCsatRequirement?: {
      description: string;
      requiredSubjectsCount: number;
      sumGradeLimit: number;
    };
  };

  // 정시 기준
  jeongsiRequirements?: {
    scoreWeights: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      koreanHistory: number;
    };
    expectedConvertedCutoff: number;
  };
}

export interface DDayMilestone {
  title: string;
  targetDate: string;
  tag: string;
  isImportant?: boolean;
}

export interface ChildProfile {
  id: string;
  name: string;
  currentGrade: GradeLevel;
  targetAdmissionYear: AdmissionYear;
  targetMajorField: string;
  completedSemesters: SemesterKey[];
  courses: SemesterCourseGrade[];
  mockExams: MockExamRecord[];
  targetUniversities: TargetUniversity[];
  dDayMilestones: DDayMilestone[];
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
