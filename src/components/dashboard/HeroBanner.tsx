'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { Calendar, Target, Sparkles, BookOpen } from 'lucide-react';

export default function HeroBanner() {
  const { activeChild, calculateCumulativeGPA, calculateDDay } = useAdmissions();
  const currentGPA = calculateCumulativeGPA(activeChild.courses);

  return (
    <div className="w-full bg-peach/70 rounded-3xl border-2 border-navy p-6 md:p-8 shadow-retro-lg space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* 좌측 인사 및 현재 자녀 요약 */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/80 rounded-full border border-navy text-xs font-black text-navy shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            <span>2028+ 개정 5등급제 상대평가 & 통합수능 적용</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
              {activeChild.name} 대입 전략 로드맵
            </h1>
            <p className="text-sm font-medium text-navy-muted">
              희망 계열: <strong className="text-navy font-bold">{activeChild.targetMajorField}</strong> | 
              완료 학기: <span className="underline decoration-coral decoration-2 font-bold text-navy">{activeChild.completedSemesters.join(', ')} ({activeChild.completedSemesters.length}개 학기 확정)</span>
            </p>
          </div>
        </div>

        {/* 우측 D-Day 카운트다운 칩 그룹 (Happy Hues 17 Accent Colors) */}
        <div className="flex flex-wrap items-center gap-3">
          {activeChild.dDayMilestones.map((milestone, idx) => {
            const daysLeft = calculateDDay(milestone.targetDate);
            const isSoon = daysLeft <= 40;
            const chipBg = milestone.isImportant 
              ? 'bg-coral text-navy' 
              : 'bg-sky text-navy';

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl border-2 border-navy shadow-retro min-w-[110px] ${chipBg}`}
              >
                <span className="text-[11px] font-extrabold opacity-85 truncate max-w-[120px]">
                  {milestone.title}
                </span>
                <span className="text-2xl font-black tracking-tight mt-0.5">
                  {daysLeft >= 0 ? `D-${daysLeft}` : `D+${Math.abs(daysLeft)}`}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 하단 서브 정보 바 */}
      <div className="pt-4 border-t-2 border-navy/20 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-navy">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-navy" />
            <span>현재 누적 내신:</span>
            <span className="px-2 py-0.5 bg-white rounded-lg border border-navy text-navy font-black text-sm">
              {currentGPA > 0 ? `${currentGPA} 등급` : '계산 중'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-navy" />
            <span>역산 대상 학기:</span>
            <span className="text-navy font-extrabold underline decoration-coral decoration-2">
              {activeChild.currentGrade === 2 ? '2-2학기, 3-1학기 (남은 2학기)' : '1-2학기, 2-1학기, 2-2학기, 3-1학기 (남은 4학기)'}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-navy-muted">
          💡 Phase 2에서 인터랙티브 실시간 역산 슬라이더가 연결됩니다.
        </span>
      </div>
    </div>
  );
}
