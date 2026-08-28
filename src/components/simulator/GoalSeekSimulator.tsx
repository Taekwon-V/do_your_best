'use client';

import React, { useMemo } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { calculateGoalSeek } from '@/utils/gpaCalculator';
import { Target, Sparkles, AlertTriangle, CheckCircle2, Flame, GraduationCap, ArrowRight } from 'lucide-react';
import { TargetUniversity } from '@/types/admissions';

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

  // 학생의 실제 등록된 수시 목표 대학 목록
  const susiTargets = useMemo(() => {
    return (activeChild.targetUniversities || []).filter((t) => t.type === 'susi');
  }, [activeChild.targetUniversities]);

  const result = useMemo(() => {
    return calculateGoalSeek(
      completedCourses,
      remainingSemestersCount,
      16, // 학기당 평균 16단위
      targetGPA
    );
  }, [completedCourses, remainingSemestersCount, targetGPA]);

  // 현재 슬라이더 점수와 일치하는 목표 대학 탐색
  const activeMatchedTarget = useMemo(() => {
    return susiTargets.find(
      (t) => Math.abs((t.susiRequirements?.expectedCutoffGrade || 0) - targetGPA) < 0.015
    );
  }, [susiTargets, targetGPA]);

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
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-peach border-2 border-navy flex items-center justify-center shadow-retro shrink-0">
            <Target className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-navy tracking-tight leading-tight">
              2028 5등급제 수시 목표 등급 역산
            </h2>
            <p className="text-[11px] sm:text-xs text-navy-muted font-medium mt-0.5">
              {activeChild.name} (현재 확정 {result.currentGPA}등급 / 잔여 {remainingSemestersCount}개 학기 대상)
            </p>
          </div>
        </div>

        {/* 수시 목표 대학 빠른 선택 칩 버튼 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-navy-muted mr-1 hidden sm:inline">목표 대학:</span>
          {susiTargets.length > 0 ? (
            susiTargets.map((t) => {
              const cutoff = t.susiRequirements?.expectedCutoffGrade || 1.5;
              const isSelected = Math.abs(targetGPA - cutoff) < 0.015;
              return (
                <button
                  key={t.id}
                  onClick={() => setTargetGPA(cutoff)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all text-center flex items-center gap-1 ${
                    isSelected
                      ? 'bg-coral text-navy border-navy shadow-retro font-black ring-2 ring-navy/20'
                      : 'bg-cream text-navy-muted border-navy/30 hover:bg-peach/40'
                  }`}
                  title={`${t.universityName} ${t.departmentName} (${cutoff}등급)`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    t.susiCategory === 'reach' ? 'bg-red-500' :
                    t.susiCategory === 'target' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span>{t.universityName.replace('국립', '')} {cutoff}</span>
                </button>
              );
            })
          ) : (
            [
              { name: '인하대 (1.33)', gpa: 1.33 },
              { name: '인천대 (1.48)', gpa: 1.48 },
              { name: '중앙대 (1.28)', gpa: 1.28 },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => setTargetGPA(preset.gpa)}
                className="px-2.5 py-1 rounded-xl text-xs font-bold border bg-cream text-navy-muted border-navy/30 hover:bg-peach/40"
              >
                {preset.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* 2. 등록된 수시 6장 목표 대학 원클릭 카드 슬롯 */}
      {susiTargets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-navy flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-coral" />
              <span>등록된 수시 6장 목표 대학별 맞춤 필요 등급</span>
            </span>
            <span className="text-[11px] text-navy-muted">클릭 시 해당 대학 목표 등급으로 즉시 역산됩니다.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {susiTargets.map((t) => {
              const cutoff = t.susiRequirements?.expectedCutoffGrade || 1.5;
              const isSelected = Math.abs(targetGPA - cutoff) < 0.015;
              
              // 해당 대학 전용 역산 계산
              const targetGoalResult = calculateGoalSeek(
                completedCourses,
                remainingSemestersCount,
                16,
                cutoff
              );

              return (
                <div
                  key={t.id}
                  onClick={() => setTargetGPA(cutoff)}
                  className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-peach/40 border-navy shadow-retro scale-[1.02]'
                      : 'bg-cream/40 border-navy/20 hover:bg-cream hover:border-navy/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded ${
                      t.susiCategory === 'reach' ? 'bg-red-100 text-red-700' :
                      t.susiCategory === 'target' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.susiCategory === 'reach' ? '소신' : t.susiCategory === 'target' ? '적정' : '안정'}
                    </span>
                    <span className="text-[10px] font-black text-navy">{cutoff}등급</span>
                  </div>

                  <p className="font-black text-xs text-navy truncate" title={t.universityName}>
                    {t.universityName}
                  </p>
                  <p className="text-[10px] text-navy/70 truncate" title={t.departmentName}>
                    {t.departmentName}
                  </p>

                  <div className="pt-1 border-t border-navy/10 flex items-center justify-between text-[10px]">
                    <span className="text-navy/60">필요:</span>
                    <span className={`font-black ${
                      !targetGoalResult.isAchievable ? 'text-rose-600' :
                      targetGoalResult.requiredRemainingGPA <= 1.2 ? 'text-coral' : 'text-emerald-700'
                    }`}>
                      {targetGoalResult.isAchievable ? `${targetGoalResult.requiredRemainingGPA}등급` : '불가 ⚠️'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 인터랙티브 슬라이더 컨트롤 */}
      <div className="bg-cream/70 rounded-2xl border-2 border-navy/20 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
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
            <span>1.33 (인하대 수학교육)</span>
            <span>1.48 (인천대 수학교육)</span>
            <span>1.86 (인천대 컴공)</span>
            <span>2.50</span>
          </div>
        </div>
      </div>

      {/* 4. 실시간 역산 결과 콜아웃 카드 (Happy Hues 17 Style) */}
      <div
        className={`rounded-2xl border-2 p-5 sm:p-6 shadow-retro space-y-4 ${
          difficultyColors[result.difficultyLevel].bg
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full border border-navy shadow-sm ${
                  difficultyColors[result.difficultyLevel].badge
                }`}
              >
                {result.isAchievable ? '달성 시뮬레이션' : '달성 불가 경고 ⚠️'}
              </span>

              {/* 연동된 목표 대학 뱃지 */}
              {activeMatchedTarget && (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-navy text-navy shadow-sm flex items-center gap-1">
                  <span>🎯</span>
                  <strong>{activeMatchedTarget.universityName}</strong>
                  <span>{activeMatchedTarget.departmentName} ({activeMatchedTarget.admissionType})</span>
                </span>
              )}

              <span className="text-xs font-bold opacity-80">
                남은 {remainingSemestersCount}개 학기 (총 {result.remainingUnits}단위) 대상
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight pt-1">
              {result.isAchievable ? (
                <span>
                  {activeMatchedTarget ? (
                    <span>
                      <strong>[{activeMatchedTarget.universityName} {activeMatchedTarget.departmentName}]</strong> 합격({result.targetGPA}등급)을 위해{' '}
                    </span>
                  ) : (
                    <span>목표 {result.targetGPA}등급 달성을 위해 </span>
                  )}
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

      {/* 5. 3대 What-If 시나리오 예측 비교 바 */}
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
