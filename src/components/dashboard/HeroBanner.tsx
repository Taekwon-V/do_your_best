'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { Target, Sparkles, BookOpen } from 'lucide-react';

export default function HeroBanner() {
  const { activeChild, calculateCumulativeGPA, calculateDDay } = useAdmissions();
  const currentGPA = calculateCumulativeGPA(activeChild.courses);

  return (
    <div className="w-full bg-peach/70 rounded-3xl border-2 border-navy p-4 sm:p-6 md:p-8 shadow-retro-lg space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        
        {/* 좌측 인사 및 현재 자녀 요약 */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/80 rounded-full border border-navy text-[11px] font-black text-navy shadow-sm">
            <Sparkles className="w-3 h-3 text-coral" />
            <span>2028+ 5등급제 & 통합수능 적용</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-navy tracking-tight">
              {activeChild.name} 대입 전략 로드맵
            </h1>
            <p className="text-xs sm:text-sm font-medium text-navy-muted leading-relaxed">
              희망 계열: <strong className="text-navy font-bold">{activeChild.targetMajorField}</strong><br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              완료 학기: <span className="underline decoration-coral decoration-2 font-bold text-navy">{activeChild.completedSemesters.join(', ')} ({activeChild.completedSemesters.length}학기 확정)</span>
            </p>
          </div>
        </div>

        {/* 우측 D-Day 카운트다운 칩 그룹 (모바일에서 깔끔한 3분할 그리드) */}
        <div className="grid grid-cols-3 gap-2 w-full lg:w-auto lg:flex lg:flex-wrap">
          {activeChild.dDayMilestones.map((milestone, idx) => {
            const daysLeft = calculateDDay(milestone.targetDate);
            const chipBg = milestone.isImportant 
              ? 'bg-coral text-navy' 
              : 'bg-sky text-navy';

            // 모바일 화면을 위한 축약형 제목
            const displayTitle = milestone.title.includes('수능')
              ? `${activeChild.targetAdmissionYear} 수능`
              : milestone.title.includes('학력평가')
              ? '9월 모의'
              : milestone.title.replace('2학기 ', '');

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-2.5 sm:px-4 sm:py-3 rounded-2xl border-2 border-navy shadow-retro text-center ${chipBg}`}
              >
                <span className="text-[10px] sm:text-[11px] font-extrabold opacity-90 truncate max-w-full block">
                  {displayTitle}
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  {daysLeft >= 0 ? `D-${daysLeft}` : `D+${Math.abs(daysLeft)}`}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 하단 서브 정보 바 */}
      <div className="pt-3.5 border-t-2 border-navy/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-bold text-navy">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-navy shrink-0" />
            <span>누적 내신:</span>
            <span className="px-2 py-0.5 bg-white rounded-lg border border-navy text-navy font-black text-xs sm:text-sm">
              {currentGPA > 0 ? `${currentGPA} 등급` : '계산 중'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-navy shrink-0" />
            <span>역산 대상:</span>
            <span className="text-navy font-extrabold underline decoration-coral decoration-2 text-[11px] sm:text-xs">
              {activeChild.currentGrade === 2 ? '2-2학기, 3-1학기 (2학기)' : '1-2 ~ 3-1학기 (4학기)'}
            </span>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] text-navy-muted">
          💡 Phase 2에서 인터랙티브 실시간 역산 슬라이더가 연결됩니다.
        </span>
      </div>
    </div>
  );
}
