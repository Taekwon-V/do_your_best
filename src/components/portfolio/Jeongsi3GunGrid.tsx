'use client';

import React from 'react';
import { TargetUniversity, JeongsiGroup, MockExamRecord } from '@/types/admissions';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface Jeongsi3GunGridProps {
  targetUniversities: TargetUniversity[];
  latestMock: MockExamRecord | null;
  onAddClick: (group: JeongsiGroup) => void;
  onEditClick: (target: TargetUniversity) => void;
  onDeleteClick: (targetId: string) => void;
}

export default function Jeongsi3GunGrid({
  targetUniversities = [],
  latestMock,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: Jeongsi3GunGridProps) {
  const jeongsiCards = targetUniversities.filter((t) => t.type === 'jeongsi');

  const gaCards = jeongsiCards.filter((t) => t.jeongsiGroup === 'ga');
  const naCards = jeongsiCards.filter((t) => t.jeongsiGroup === 'na');
  const daCards = jeongsiCards.filter((t) => t.jeongsiGroup === 'da');

  // Calculate student's average percentile
  const studentAvgPercentile = (() => {
    if (!latestMock) return 0;
    const math = latestMock.scores.math.percentile ?? 0;
    const korean = latestMock.scores.korean.percentile ?? 0;
    const soc = latestMock.scores.integratedSocial.percentile ?? 0;
    const sci = latestMock.scores.integratedScience.percentile ?? 0;
    return Number(((korean * 0.3 + math * 0.4 + ((soc + sci) / 2) * 0.3)).toFixed(1));
  })();

  const renderGroupColumn = (
    title: string,
    groupKey: JeongsiGroup,
    cards: TargetUniversity[],
    badgeColor: string,
    borderColor: string
  ) => {
    return (
      <div className={`rounded-3xl p-4 sm:p-5 border-2 ${borderColor} flex flex-col justify-between`}>
        <div>
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-peach/30">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${badgeColor}`}>
              [{title}] 목표 슬롯
            </span>
            <span className="text-xs font-bold text-midnight/70">
              {cards.length}개 등록
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {cards.map((target) => {
              const targetCut = target.jeongsiRequirements?.percentileCutoff ?? 85.0;
              const gap = Number((studentAvgPercentile - targetCut).toFixed(1));
              const isSafe = gap >= 0;

              return (
                <div
                  key={target.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-peach/50 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-midnight text-sm sm:text-base">
                        {target.universityName}
                      </h4>
                      <p className="text-xs text-midnight/70 font-medium">
                        {target.departmentName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditClick(target)}
                        className="p-1 rounded-lg text-midnight/50 hover:text-midnight hover:bg-peach/30"
                        title="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(target.id)}
                        className="p-1 rounded-lg text-midnight/40 hover:text-coral hover:bg-coral/10"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-peach/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-midnight/60">70% 합격선:</span>
                      <strong className="text-midnight">백분위 {targetCut}%</strong>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-navy-muted font-bold">모의고사 Gap:</span>
                      <span
                        className={`text-[10.5px] font-black px-2 py-0.5 rounded-md border ${
                          isSafe
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-coral/25 text-navy border-coral'
                        }`}
                      >
                        {isSafe ? `+${gap}%p 안정권 ✅` : `${gap}%p 부족 ⚠️`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {cards.length === 0 && (
              <button
                onClick={() => onAddClick(groupKey)}
                className="w-full py-4 border-2 border-dashed border-peach/70 hover:border-navy rounded-2xl bg-white/40 hover:bg-white text-midnight/60 hover:text-midnight font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ [{title}] 목표 대학 등록하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-peach/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
            <GraduationCap className="w-4 h-4 text-midnight" />
          </div>
          <div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              정시 가 / 나 / 다군 3개 군 포트폴리오
            </h3>
            <p className="text-xs text-midnight/60">
              군별 목표 대학 배치 및 최근 모의고사({studentAvgPercentile}%) 기준 실시간 Gap 비교
            </p>
          </div>
        </div>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderGroupColumn('가군', 'ga', gaCards, 'bg-coral/20 text-coral', 'bg-cream/40 border-peach/50')}
        {renderGroupColumn('나군', 'na', naCards, 'bg-pastel-sky/40 text-navy', 'bg-cream/40 border-peach/50')}
        {renderGroupColumn('다군', 'da', daCards, 'bg-amber-100 text-amber-800', 'bg-cream/40 border-peach/50')}
      </div>
    </div>
  );
}
