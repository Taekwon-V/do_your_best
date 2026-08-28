# [모듈 5] 데이터 모델 & 시스템 아키텍처 (다자녀 지원 & 영속화)

## 1. 데이터 보안 및 다자녀(고2, 고1) 저장 원칙
- **로컬 우선 & 클라우드 실시간 듀얼 동기화 (Local-First + Cloud Timestamp Sync)**:
  * 가족 구글 계정 인증 하에 **고2(첫째), 고1(둘째) 자녀별 독립 프로필**로 성적 및 목표 데이터를 격리 저장합니다.
  * **타임스탬프(`updatedAt`) 기반 충돌 방지**: 모든 성적 및 목표 수정 시 밀리초 단위 타임스탬프를 부여하여, 새로고침이나 오프라인 재접속 시 데이터가 덮어씌워지지 않고 항상 최신 상태를 유지합니다.
  * **클라우드 실시간 동기화 (Cloud Firestore `onSnapshot`)**: 부모님이 PC에서 수정한 내용이 자녀의 스마트폰에 새로고침 없이 즉각 반영됩니다.
  * **JSON 백업 & 복원**: 원클릭으로 전체 가족 데이터를 파일로 내려받고 언제든 완벽하게 복원할 수 있습니다.

---

## 2. 데이터 엔티티 스키마 (TypeScript Interfaces - `src/types/admissions.ts`)

```typescript
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

// 1. 수시 내신 과목 성적 (2028/2029 공통 5등급제)
export interface SemesterCourseGrade {
  id: string;
  semester: SemesterKey;
  isSimulated?: boolean; // 가상 역산 성적인지 여부
  category: SubjectCategory;
  courseName: string;
  unitCount: number; // 단위수 (e.g. 4)
  rankGrade: number; // 석차등급 (1 ~ 5)
  achievement: AchievementLevel;
  rawScore?: number;
  classAverage?: number;
}

// 2. 모의고사 성적 (2028 통합형 수능 체계)
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

// 3. 목표 대학 및 학과 포트폴리오
export type SusiCategory = 'safe' | 'target' | 'reach'; // 안정, 적정, 소신
export type JeongsiGroup = 'ga' | 'na' | 'da'; // 가군, 나군, 다군

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
    expectedCutoffGrade?: number; // 5등급제 환산 70% Cut
    minimumCsatRequirement?: {
      description: string;
      requiredSubjectsCount: number;
      sumGradeLimit: number;
    };
  };
  jeongsiRequirements?: {
    convertedStandardScoreCutoff?: number;
    percentileCutoff?: number; // 70% Cut 백분위
    subjectWeights: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      history: number;
    };
  };
}

// 4. D-Day 마일스톤
export interface DDayMilestone {
  title: string;
  targetDate: string;
  tag: '내신' | '모의고사' | '수능' | '수시원서';
  isImportant?: boolean;
}

// 5. 자녀 프로필 (고2: 2028 대입 / 고1: 2029 대입)
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

// 6. 전체 가족 데이터 컨테이너
export interface FamilyAppData {
  familyId: string;
  activeChildId: string; // 현재 선택된 자녀 ID
  allowedEmails: string[]; // 온 가족 구글 이메일 화이트리스트
  children: ChildProfile[];
  updatedAt?: number; // 밀리초 타임스탬프 (클라우드 동기화 충돌 방지)
}
```

---

## 3. AdmissionsContext API & 영속화 라이프사이클

```typescript
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
  
  // 과목 성적 CRUD
  addCourse: (childId: string, course: SemesterCourseGrade) => void;
  updateCourse: (childId: string, course: SemesterCourseGrade) => void;
  updateMultipleCourses: (childId: string, courses: SemesterCourseGrade[]) => void;
  deleteCourse: (childId: string, courseId: string) => void;
  
  // 모의고사 CRUD
  addMockExam: (childId: string, exam: MockExamRecord) => void;
  updateMockExam: (childId: string, exam: MockExamRecord) => void;
  deleteMockExam: (childId: string, examId: string) => void;
  
  // 목표 대학 CRUD
  addTargetUniversity: (childId: string, target: TargetUniversity) => void;
  updateTargetUniversity: (childId: string, target: TargetUniversity) => void;
  deleteTargetUniversity: (childId: string, targetId: string) => void;
  
  // 계산 & 영속화 유틸리티
  calculateCumulativeGPA: (courses: SemesterCourseGrade[]) => number;
  calculateDDay: (targetDateStr: string) => number;
  exportDataAsJSON: () => void;
  importDataFromJSON: (jsonString: string) => boolean;
  resetToInitialData: () => void;
}
```
