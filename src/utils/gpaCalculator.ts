import { SemesterCourseGrade, SemesterKey } from '@/types/admissions';

export interface GoalSeekResult {
  targetGPA: number;
  currentGPA: number;
  currentUnits: number;
  remainingUnits: number;
  totalUnits: number;
  requiredRemainingGPA: number;
  isAchievable: boolean;
  maxPossibleGPA: number;
  difficultyLevel: 'easy' | 'moderate' | 'challenging' | 'impossible';
  adviceMessage: string;
  scenarios: {
    label: string;
    remainingAvgGrade: number;
    finalGPA: number;
    description: string;
  }[];
}

// 2028 5등급제 등급별 상위 누적 백분위 메타데이터
export const GRADE_5_PERCENTILES: Record<number, { label: string; cumulativePercent: string; color: string }> = {
  1: { label: '1등급', cumulativePercent: '상위 10%', color: 'bg-emerald-500 text-white' },
  2: { label: '2등급', cumulativePercent: '상위 34%', color: 'bg-sky-500 text-white' },
  3: { label: '3등급', cumulativePercent: '상위 66%', color: 'bg-amber-500 text-navy' },
  4: { label: '4등급', cumulativePercent: '상위 90%', color: 'bg-orange-500 text-white' },
  5: { label: '5등급', cumulativePercent: '상위 100%', color: 'bg-rose-500 text-white' },
};

/**
 * 2028 5등급제 단위수 가중평균 계산: ∑(단위수 × 석차등급) / ∑총단위수
 */
export function calculateWeightedGPA(courses: SemesterCourseGrade[]): number {
  if (!courses || courses.length === 0) return 0;
  
  let totalUnits = 0;
  let weightedSum = 0;

  for (const c of courses) {
    if (c.rankGrade && c.unitCount && c.unitCount > 0) {
      totalUnits += c.unitCount;
      weightedSum += c.unitCount * c.rankGrade;
    }
  }

  if (totalUnits === 0) return 0;
  return Number((weightedSum / totalUnits).toFixed(2));
}

/**
 * 특정 학기만의 가중평균 계산
 */
export function calculateSemesterGPA(courses: SemesterCourseGrade[], semester: SemesterKey): { gpa: number; units: number } {
  const semesterCourses = courses.filter((c) => c.semester === semester);
  const units = semesterCourses.reduce((sum, c) => sum + (c.unitCount || 0), 0);
  const gpa = calculateWeightedGPA(semesterCourses);
  return { gpa, units };
}

/**
 * 목표 등급 역산 (Goal-Seek) 계산기
 * 
 * 공식:
 * Required Remaining GPA = (Target GPA * Total Units - Current Units * Current GPA) / Remaining Units
 */
export function calculateGoalSeek(
  completedCourses: SemesterCourseGrade[],
  remainingSemestersCount: number,
  avgUnitsPerSemester: number = 16,
  targetGPA: number = 1.15
): GoalSeekResult {
  const currentUnits = completedCourses.reduce((sum, c) => sum + (c.unitCount || 0), 0);
  const currentGPA = calculateWeightedGPA(completedCourses);
  const currentWeightedSum = completedCourses.reduce((sum, c) => sum + ((c.unitCount || 0) * (c.rankGrade || 1)), 0);

  const remainingUnits = Math.max(1, remainingSemestersCount * avgUnitsPerSemester);
  const totalUnits = currentUnits + remainingUnits;

  // 남은 학기 전부 올 1.0(만점)을 받았을 때 달성 가능한 최상의 등급
  const maxPossibleGPA = Number(((currentWeightedSum + remainingUnits * 1.0) / totalUnits).toFixed(2));

  // 목표 달성에 필요한 잔여 학기 총 가중합 및 요구 평균 등급
  const requiredTotalSum = targetGPA * totalUnits;
  const requiredRemainingSum = requiredTotalSum - currentWeightedSum;
  const requiredRemainingGPA = Number((requiredRemainingSum / remainingUnits).toFixed(2));

  // 달성 가능 여부 판정
  const isAchievable = requiredRemainingGPA >= 1.00;

  let difficultyLevel: GoalSeekResult['difficultyLevel'] = 'moderate';
  let adviceMessage = '';

  if (!isAchievable) {
    difficultyLevel = 'impossible';
    adviceMessage = `⚠️ 남은 ${remainingSemestersCount}개 학기를 모두 1.0(올 1등급)으로 마쳐도 최대 ${maxPossibleGPA}등급까지만 달성 가능합니다. 목표 등급을 ${maxPossibleGPA}등급으로 조정하는 것을 추천합니다.`;
  } else if (requiredRemainingGPA <= 1.05) {
    difficultyLevel = 'challenging';
    adviceMessage = `🔥 매우 도전적인 목표입니다! 남은 학기 동안 거의 모든 과목에서 1등급(상위 10%)을 유지해야 합니다 (요구 평균: ${requiredRemainingGPA}등급).`;
  } else if (requiredRemainingGPA <= 1.30) {
    difficultyLevel = 'moderate';
    adviceMessage = `🎯 충분히 달성 가능한 사정권입니다! 남은 학기 평균 ${requiredRemainingGPA}등급(주요 과목 1등급, 일부 2등급 이내)을 목표로 관리하세요.`;
  } else {
    difficultyLevel = 'easy';
    adviceMessage = `✨ 매우 여유 있는 안정권 목표입니다! 남은 학기 평균 ${requiredRemainingGPA}등급만 유지해도 목표를 무난히 달성합니다.`;
  }

  // 3대 시나리오 계산
  const scenarios = [
    {
      label: '시나리오 A: 올 1.00 달성 (최상 🏆)',
      remainingAvgGrade: 1.00,
      finalGPA: Number(((currentWeightedSum + remainingUnits * 1.00) / totalUnits).toFixed(2)),
      description: '남은 모든 과목 1등급(상위 10%) 달성 시',
    },
    {
      label: '시나리오 B: 1.20 유지 (적정 🎯)',
      remainingAvgGrade: 1.20,
      finalGPA: Number(((currentWeightedSum + remainingUnits * 1.20) / totalUnits).toFixed(2)),
      description: '주요 과목 1등급 + 일부 2등급 유지 시',
    },
    {
      label: '시나리오 C: 1.50 기록 (보수적 🛡️)',
      remainingAvgGrade: 1.50,
      finalGPA: Number(((currentWeightedSum + remainingUnits * 1.50) / totalUnits).toFixed(2)),
      description: '1등급 및 2등급 절반씩 기록 시',
    },
  ];

  return {
    targetGPA,
    currentGPA,
    currentUnits,
    remainingUnits,
    totalUnits,
    requiredRemainingGPA: isAchievable ? requiredRemainingGPA : 1.00,
    isAchievable,
    maxPossibleGPA,
    difficultyLevel,
    adviceMessage,
    scenarios,
  };
}
