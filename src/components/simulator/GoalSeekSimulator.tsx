'use client';

import React, { useMemo } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { calculateGoalSeek } from '@/utils/gpaCalculator';
import { Target, Sparkles, AlertTriangle, CheckCircle2, Flame, HelpCircle } from 'lucide-react';

const PRESET_TARGETS = [
  { name: '서울대 상위 (1.10)', gpa: 1.10, badge: '최상위 🏆' },
  { name: '연세대/고려대 (1.25)', gpa: 1.25, badge: 'SKY 🌟' },
  { name: '서강대/성균관대 (1.40)', gpa: 1.40, badge: '주요대 🎯' },
  { name: '중앙대/한양대 (1.55)', gpa: 1.55, badge: '인서울 🏫' },
];

export default function GoalSeekSimulator() {
  const { activeChild, targetGPA, setTargetGPA } = useAdmissions();

  // 확정 이수 과목과 남은 학기 수 계산
  const completedCourses = useMemo(() => {
    return activeChild.courses.filter((c) => !c.isSimulated);
  }, [activeChild.courses]);

  const remainingSemestersCount = useMemo(() => {
    // 고2: 3학기 완료(1-1, 1-2, 2-1) -> 2학기 남음(2-2, 3-1)
    // 고1: 1학기 완료(1-1) -> 4학기 남음(1-2, 2-1, 2-2, 3-1)
    return Math.max(1, 5 - activeChild.completedSemesters.length);
  }, [activeChild.completedSemesters]);

  const result = useMemo(() => {
    return calculateGoalSeek(
      completedCourses,
      remainingSemestersCount,
      16, // 학기당 평균 16단위
      targetGPA
    );
  }, [completedCourses, remainingSemestersCount, targetGPA]);

  const difficultyColors = {
    easy: { bg: 'bg-emerald-100 border-emerald-500 text-emerald-900', badge: 'bg-emerald-500 text-white' },
    moderate: { bg: 'bg-sky-100 border-sky-500 text-navy', badge: 'bg-sky text-navy' },
    challenging: { bg: 'bg-amber-100 border-amber-500 text-amber-950', badge: 'bg-coral text-navy' },
    impossible: { bg: 'bg-rose-100 border-rose-500 text-rose-950', badge: 'bg-rose-500 text-white' },
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-navy p-5 sm:p-7 shadow-retro-lg space-y-6">
      
      {/* 1. 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-navy/15">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-peach border-2 border-navy flex items-center justify-center shadow-retro shrink-0">
            <Target className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-navy tracking-tight">
              2028 5등급제 수시 목표 등급 역산 (Goal-Seek)
            </h2>
            <p className="text-xs text-navy-muted font-medium">
              {activeChild.name} (현재 {result.currentGPA}등급 / 잔여 {remainingSemestersCount}개 학기 역산)
            </p>
          </div>
        </div>

        {/* 빠른 프리셋 목표 버튼 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_TARGETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setTargetGPA(preset.gpa)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                Math.abs(targetGPA - preset.gpa) < 0.01
                  ? 'bg-coral text-navy border-navy shadow-retro font-black'
                  : 'bg-cream text-navy-muted border-navy/30 hover:bg-peach/40'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 인터랙티브 슬라이더 컨트롤 */}
      <div className="bg-cream/70 rounded-2xl border-2 border-navy/20 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-navy">최종 목표 수시 내신:</span>
            <span className="text-xs font-bold text-navy-muted">(수시 원서 접수 기준 3-1학기까지 누적)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-navy px-3 py-1 bg-white rounded-xl border-2 border-navy shadow-sm">
              {targetGPA.toFixed(2)} 등급
            </span>
          </div>
        </div>

        {/* 슬라이더 인풋 */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="1.00"
            max="2.50"
            step="0.01"
            value={targetGPA}
            onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
            className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer border border-navy accent-coral"
          />
          <div className="flex justify-between text-[11px] font-extrabold text-navy-muted">
            <span>1.00 (만점 목표)</span>
            <span>1.50 (인서울 상위)</span>
            <span>2.00 (수도권 주요)</span>
            <span>2.50</span>
          </div>
        </div>
      </div>

      {/* 3. 실시간 역산 결과 콜아웃 카드 (Happy Hues 17 Style) */}
      <div
        className={`rounded-2xl border-2 p-5 sm:p-6 shadow-retro space-y-4 ${
          difficultyColors[result.difficultyLevel].bg
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full border border-navy shadow-sm ${
                  difficultyColors[result.difficultyLevel].badge
                }`}
              >
                {result.isAchievable ? '달성 시뮬레이션' : '달성 불가 경고 ⚠️'}
              </span>
              <span className="text-xs font-bold opacity-80">
                남은 {remainingSemestersCount}개 학기 (총 {result.remainingUnits}단위) 대상
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight pt-1">
              {result.isAchievable ? (
                <span>
                  목표 {result.targetGPA}등급 달성을 위해{' '}
                  <span className="underline decoration-coral decoration-4 font-black">
                    남은 학기 평균 {result.requiredRemainingGPA}등급
                  </span>
                  이 필요합니다!
                </span>
              ) : (
                <span>
                  목표 달성 불가 (남은 학기 올 1.0 시 최대 {result.maxPossibleGPA}등급 가능)
                </span>
              )}
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-navy shadow-sm min-w-[120px] shrink-0">
            <span className="text-[10px] font-bold text-navy-muted block">요구 평균 등급</span>
            <span className="text-2xl font-black text-navy">
              {result.isAchievable ? `${result.requiredRemainingGPA}등급` : '올 1.0 초과'}
            </span>
            <span className="text-[10px] font-bold text-navy-muted">
              {result.isAchievable ? (result.requiredRemainingGPA <= 1.1 ? '상위 10% 유지 필수' : '1~2등급 혼합 가능') : '한계선 도달'}
            </span>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-xs sm:text-sm font-bold leading-relaxed border-t border-navy/15 pt-3">
          {result.adviceMessage}
        </p>
      </div>

      {/* 4. 3대 What-If 시나리오 예측 비교 바 */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-navy flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span>남은 {remainingSemestersCount}개 학기 성적 시나리오별 최종 졸업 내신 예측</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.scenarios.map((sc, idx) => (
            <div
              key={idx}
              className="bg-cream/60 rounded-2xl border-2 border-navy/20 p-3.5 shadow-sm space-y-1.5 hover:bg-cream transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-navy">{sc.label}</span>
                <span className="font-black text-navy px-2 py-0.5 bg-white rounded-lg border border-navy/30 text-sm">
                  {sc.finalGPA} 등급
                </span>
              </div>
              <p className="text-[11px] text-navy-muted font-medium">
                {sc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
