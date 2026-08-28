import { ChildProfile, FamilyAppData } from '@/types/admissions';

export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1-go2',
    name: '고2 아들',
    currentGrade: 2,
    targetAdmissionYear: 2028,
    targetMajorField: '컴퓨터공학 / AI 융합',
    completedSemesters: ['1-1', '1-2', '2-1'],
    dDayMilestones: [
      { title: '2학기 중간고사', targetDate: '2026-10-05', tag: '내신', isImportant: true },
      { title: '9월 전국연합학력평가', targetDate: '2026-09-09', tag: '모의고사' },
      { title: '2028학년도 대학수학능력시험', targetDate: '2027-11-18', tag: '수능', isImportant: true },
    ],
    courses: [],
    mockExams: [],
    targetUniversities: [],
  },
  {
    id: 'child-2-go1',
    name: '고1 딸',
    currentGrade: 1,
    targetAdmissionYear: 2029,
    targetMajorField: '경영학 / 데이터 비즈니스',
    completedSemesters: ['1-1'],
    dDayMilestones: [
      { title: '2학기 중간고사', targetDate: '2026-10-05', tag: '내신', isImportant: true },
      { title: '9월 전국연합학력평가', targetDate: '2026-09-09', tag: '모의고사' },
      { title: '2029학년도 대학수학능력시험', targetDate: '2028-11-16', tag: '수능', isImportant: true },
    ],
    courses: [],
    mockExams: [],
    targetUniversities: [],
  },
];

export const INITIAL_FAMILY_DATA: FamilyAppData = {
  familyId: 'our-happy-family',
  activeChildId: 'child-1-go2',
  allowedEmails: [
    'inchul17.kim@gmail.com',
    'inchul17kim@gmail.com',
    'mybest1725@gmail.com',
    'dreamingjacob4628@gmail.com',
    'happydana4628@gmail.com',
  ],
  children: INITIAL_CHILDREN,
  updatedAt: 0,
};
