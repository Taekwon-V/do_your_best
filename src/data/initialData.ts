import { ChildProfile, FamilyAppData } from '@/types/admissions';

export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1-go2',
    name: '고2 첫째',
    currentGrade: 2,
    targetAdmissionYear: 2028,
    targetMajorField: '컴퓨터공학 / AI 융합',
    completedSemesters: ['1-1', '1-2', '2-1'],
    dDayMilestones: [
      { title: '2학기 중간고사', targetDate: '2026-10-05', tag: '내신', isImportant: true },
      { title: '9월 전국연합학력평가', targetDate: '2026-09-09', tag: '모의고사' },
      { title: '2028학년도 대학수학능력시험', targetDate: '2027-11-18', tag: '수능', isImportant: true },
    ],
    courses: [
      // 1-1 성적
      { id: 'c1-1', semester: '1-1', category: '국어', courseName: '공통국어1', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-2', semester: '1-1', category: '수학', courseName: '공통수학1', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-3', semester: '1-1', category: '영어', courseName: '공통영어1', unitCount: 4, rankGrade: 2, achievement: 'A' },
      { id: 'c1-4', semester: '1-1', category: '과학', courseName: '통합과학1', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-5', semester: '1-1', category: '사회', courseName: '통합사회1', unitCount: 3, rankGrade: 2, achievement: 'A' },
      { id: 'c1-6', semester: '1-1', category: '한국사', courseName: '한국사1', unitCount: 3, rankGrade: 1, achievement: 'A' },
      // 1-2 성적
      { id: 'c1-7', semester: '1-2', category: '국어', courseName: '공통국어2', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-8', semester: '1-2', category: '수학', courseName: '공통수학2', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-9', semester: '1-2', category: '영어', courseName: '공통영어2', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-10', semester: '1-2', category: '과학', courseName: '통합과학2', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-11', semester: '1-2', category: '사회', courseName: '통합사회2', unitCount: 3, rankGrade: 2, achievement: 'A' },
      { id: 'c1-12', semester: '1-2', category: '한국사', courseName: '한국사2', unitCount: 3, rankGrade: 1, achievement: 'A' },
      // 2-1 성적
      { id: 'c1-13', semester: '2-1', category: '국어', courseName: '문학과 매체', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-14', semester: '2-1', category: '수학', courseName: '대수', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-15', semester: '2-1', category: '영어', courseName: '영어 독해와 작문', unitCount: 4, rankGrade: 2, achievement: 'A' },
      { id: 'c1-16', semester: '2-1', category: '과학', courseName: '물리학', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c1-17', semester: '2-1', category: '과학', courseName: '화학', unitCount: 4, rankGrade: 2, achievement: 'A' },
    ],
    mockExams: [
      {
        id: 'm1-1',
        gradeLevel: 2,
        examMonth: 6,
        examName: '2026년 고2 6월 학력평가',
        examDate: '2026-06-04',
        scores: {
          korean: { standardScore: 134, percentile: 97, grade: 1 },
          math: { standardScore: 138, percentile: 98, grade: 1 },
          english: { rawScore: 92, grade: 1 },
          koreanHistory: { rawScore: 45, grade: 1 },
          integratedSocial: { standardScore: 66, percentile: 94, grade: 1 },
          integratedScience: { standardScore: 68, percentile: 98, grade: 1 },
        },
      },
    ],
    targetUniversities: [
      {
        id: 'u1-1',
        type: 'susi',
        susiCategory: 'reach',
        universityName: '서울대학교',
        departmentName: '컴퓨터공학부 (지역균형)',
        admissionType: '종합',
        susiRequirements: {
          subjectWeight: { 전교과: 1.0 },
          gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
          expectedCutoffGrade: 1.08,
          minimumCsatRequirement: {
            description: '국수영탐 중 3개 영역 합 7 이내',
            requiredSubjectsCount: 3,
            sumGradeLimit: 7,
          },
        },
      },
      {
        id: 'u1-2',
        type: 'susi',
        susiCategory: 'target',
        universityName: '연세대학교',
        departmentName: '인공지능학과 (추천형)',
        admissionType: '교과',
        susiRequirements: {
          subjectWeight: { 국어: 1.0, 수학: 1.0, 영어: 1.0, 과학: 1.0 },
          gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
          expectedCutoffGrade: 1.18,
          minimumCsatRequirement: {
            description: '국수 중 1개 포함 2개 합 5 이내, 영 3, 한 4',
            requiredSubjectsCount: 2,
            sumGradeLimit: 5,
          },
        },
      },
      {
        id: 'u1-3',
        type: 'susi',
        susiCategory: 'safe',
        universityName: '고려대학교',
        departmentName: '데이터과학과 (학교추천)',
        admissionType: '교과',
        susiRequirements: {
          subjectWeight: { 국어: 1.0, 수학: 1.0, 영어: 1.0, 과학: 1.0 },
          gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
          expectedCutoffGrade: 1.32,
          minimumCsatRequirement: {
            description: '국수영탐 3개 영역 합 7 이내',
            requiredSubjectsCount: 3,
            sumGradeLimit: 7,
          },
        },
      },
    ],
  },
  {
    id: 'child-2-go1',
    name: '고1 둘째',
    currentGrade: 1,
    targetAdmissionYear: 2029,
    targetMajorField: '경영학 / 빅데이터 금융',
    completedSemesters: ['1-1'],
    dDayMilestones: [
      { title: '2학기 중간고사', targetDate: '2026-10-05', tag: '내신', isImportant: true },
      { title: '9월 전국연합학력평가', targetDate: '2026-09-09', tag: '모의고사' },
      { title: '2029학년도 대학수학능력시험', targetDate: '2028-11-16', tag: '수능', isImportant: true },
    ],
    courses: [
      // 1-1 성적
      { id: 'c2-1', semester: '1-1', category: '국어', courseName: '공통국어1', unitCount: 4, rankGrade: 2, achievement: 'A' },
      { id: 'c2-2', semester: '1-1', category: '수학', courseName: '공통수학1', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c2-3', semester: '1-1', category: '영어', courseName: '공통영어1', unitCount: 4, rankGrade: 2, achievement: 'A' },
      { id: 'c2-4', semester: '1-1', category: '사회', courseName: '통합사회1', unitCount: 4, rankGrade: 1, achievement: 'A' },
      { id: 'c2-5', semester: '1-1', category: '과학', courseName: '통합과학1', unitCount: 4, rankGrade: 2, achievement: 'A' },
      { id: 'c2-6', semester: '1-1', category: '한국사', courseName: '한국사1', unitCount: 3, rankGrade: 2, achievement: 'A' },
    ],
    mockExams: [
      {
        id: 'm2-1',
        gradeLevel: 1,
        examMonth: 6,
        examName: '2026년 고1 6월 학력평가',
        examDate: '2026-06-04',
        scores: {
          korean: { standardScore: 130, percentile: 94, grade: 2 },
          math: { standardScore: 137, percentile: 98, grade: 1 },
          english: { rawScore: 88, grade: 2 },
          koreanHistory: { rawScore: 40, grade: 2 },
          integratedSocial: { standardScore: 68, percentile: 99, grade: 1 },
          integratedScience: { standardScore: 63, percentile: 92, grade: 2 },
        },
      },
    ],
    targetUniversities: [
      {
        id: 'u2-1',
        type: 'susi',
        susiCategory: 'reach',
        universityName: '연세대학교',
        departmentName: '경영학과 (활동우수형)',
        admissionType: '종합',
        susiRequirements: {
          subjectWeight: { 전교과: 1.0 },
          gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
          expectedCutoffGrade: 1.15,
          minimumCsatRequirement: {
            description: '국수 중 1개 포함 2개 합 4 이내, 영 3, 한 4',
            requiredSubjectsCount: 2,
            sumGradeLimit: 4,
          },
        },
      },
      {
        id: 'u2-2',
        type: 'susi',
        susiCategory: 'target',
        universityName: '서강대학교',
        departmentName: '경영학부 (지역균형)',
        admissionType: '교과',
        susiRequirements: {
          subjectWeight: { 국어: 1.0, 수학: 1.0, 영어: 1.0, 사회: 1.0 },
          gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
          expectedCutoffGrade: 1.35,
          minimumCsatRequirement: {
            description: '국수영탐 3개 영역 각 3등급 이내, 한국사 4',
            requiredSubjectsCount: 3,
            sumGradeLimit: 9,
          },
        },
      },
    ],
  },
];

export const INITIAL_FAMILY_DATA: FamilyAppData = {
  familyId: 'our-happy-family',
  activeChildId: 'child-1-go2',
  allowedEmails: [
    'family.manager@gmail.com',
    'father@gmail.com',
    'mother@gmail.com',
    'child1@gmail.com',
    'child2@gmail.com',
  ],
  children: INITIAL_CHILDREN,
};
