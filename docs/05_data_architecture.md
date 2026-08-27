# [모듈 5] 데이터 모델 & 시스템 아키텍처 (다자녀 지원)

## 1. 데이터 보안 및 다자녀(고2, 고1) 저장 원칙
- **로컬 & 클라우드 하이브리드 (Local-First + Cloud Sync)**:
  * 가족 구글 계정 인증 하에 **고2(첫째), 고1(둘째) 자녀별 독립 프로필**로 성적 및 목표 데이터를 격리 저장합니다.
  * 기기 간 실시간 동기화(Firestore / DB) 및 JSON 백업/복원을 지원합니다.

---

## 2. 데이터 엔티티 스키마 (TypeScript Interfaces)

```typescript
// 1. 전체 가족 데이터 컨테이너
export interface FamilyAppData {
  familyId: string;
  activeChildId: string; // 현재 선택된 자녀 ID
  allowedEmails: string[]; // 부모님 및 자녀 구글 이메일 화이트리스트
  children: ChildProfile[];
}

// 2. 자녀 프로필 (고2: 2028 대입 / 고1: 2029 대입)
export interface ChildProfile {
  id: string; // e.g. "child_1_go2", "child_2_go1"
  name: string; // 자녀 이름 (예: "첫째", "민우")
  currentGrade: 1 | 2; // 1: 고1, 2: 고2
  targetAdmissionYear: 2028 | 2029;
  targetMajorField: 'engineering' | 'humanities' | 'natural_science' | 'medicine' | 'social_science';
  
  // 학기별 완료 상태
  // 고2: ['1-1', '1-2', '2-1'] 완료 / 고1: ['1-1'] 완료
  completedSemesters: ('1-1' | '1-2' | '2-1' | '2-2' | '3-1')[];
  
  courses: SemesterCourseGrade[];
  mockExams: MockExamRecord[];
  targetUniversities: TargetUniversity[];
  
  dDayMilestones: {
    midtermDate?: string;
    finalsDate?: string;
    nextMockExamDate?: string;
  };
}

// 3. 수시 내신 과목 성적 (2028/2029 공통 5등급제)
export interface SemesterCourseGrade {
  id: string;
  semester: '1-1' | '1-2' | '2-1' | '2-2' | '3-1';
  isSimulated?: boolean; // 가상 역산 성적인지 여부
  category: '국어' | '수학' | '영어' | '사회' | '과학' | '한국사' | '기술가정' | '기타';
  courseName: string;
  unitCount: number; // 단위수 (예: 4)
  rankGrade: number; // 석차등급 (1 ~ 5)
  achievement: 'A' | 'B' | 'C' | 'D' | 'E';
  rawScore?: number;
  classAverage?: number;
}

// 4. 모의고사 성적 (통합형 수능 체계)
export interface MockExamRecord {
  id: string;
  gradeLevel: 1 | 2 | 3; // 응시 당시 학년
  examMonth: 3 | 5 | 6 | 7 | 9 | 10 | 11;
  examName: string; // 예: "고2 6월 학력평가" / "고1 6월 학력평가"
  examDate: string;
  scores: {
    korean: { standardScore?: number; percentile?: number; grade: number };
    math: { standardScore?: number; percentile?: number; grade: number };
    english: { rawScore?: number; grade: number };
    koreanHistory: { rawScore?: number; grade: number };
    integratedSocial: { standardScore?: number; percentile?: number; grade: number };
    integratedScience: { standardScore?: number; percentile?: number; grade: number };
  };
}

// 5. 목표 대학 및 학과 전형
export interface TargetUniversity {
  id: string;
  type: 'susi' | 'jeongsi';
  susiCategory?: 'safe' | 'target' | 'reach'; // 안정, 적정, 소신
  jeongsiGroup?: 'ga' | 'na' | 'da'; // 가군, 나군, 다군
  universityName: string;
  departmentName: string;
  admissionType: '교과' | '종합' | '논술' | '수능위주';
  
  // 수시 기준
  susiRequirements?: {
    subjectWeight: { [category: string]: number };
    gradeWeight: { [grade: string]: number }; // 학년별 비중
    expectedCutoffGrade: number; // 5등급제 환산 예상 컷 (예: 1.25)
    minimumCsatRequirement?: {
      description: string; // "3개 합 7"
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
```
