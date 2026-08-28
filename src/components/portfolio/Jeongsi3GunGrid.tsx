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
  Target,
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

  // Compute student's university-specific weighted percentile
  const computeTargetMetrics = (target: TargetUniversity) => {
    const targetCut = target.jeongsiRequirements?.percentileCutoff ?? 85.0;
    const weights = target.jeongsiRequirements?.subjectWeights || {
      korean: 25,
      math: 40,
      inquiry: 25,
      english: 0,
      history: 0,
    };

    const wKor = weights.korean || 25;
    const wMat = weights.math || 40;
    const wInq = weights.inquiry || 25;
    const totalW = wKor + wMat + wInq || 100;

    if (!latestMock || !latestMock.scores) {
      return { score: 0, gap: 0, isSafe: false, targetCut, wKor, wMat, wInq };
    }

    const math = latestMock.scores.math?.percentile ?? 0;
    const korean = latestMock.scores.korean?.percentile ?? 0;
    const soc = latestMock.scores.integratedSocial?.percentile ?? 0;
    const sci = latestMock.scores.integratedScience?.percentile ?? 0;
    const tamgu = (soc + sci) / 2;

    const weightedScore = Number(((korean * wKor + math * wMat + tamgu * wInq) / totalW).toFixed(1));
    const gap = Number((weightedScore - targetCut).toFixed(1));
    const isSafe = gap >= 0;

    return {
      score: weightedScore,
      gap,
      isSafe,
      targetCut,
      wKor,
      wMat,
      wInq,
    };
  };

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
              const { score, gap, isSafe, targetCut, wKor, wMat, wInq } = computeTargetMetrics(target);

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

                  <div className="pt-2 border-t border-peach/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-midnight/60">70% 합격선:</span>
                      <strong className="text-midnight font-bold">백분위 {targetCut}%</strong>
                    </div>

                    {/* University-Specific Weighted Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-900 font-bold flex items-center gap-1">
                        <Target className="w-3 h-3 text-indigo-600" />
                        <span>내 맞춤 환산:</span>
                      </span>
                      <div className="text-right">
                        <strong className="text-indigo-950 font-black">
                          {latestMock ? `백분위 ${score}%` : '-'}
                        </strong>
                        <span className="text-[9.5px] text-indigo-600/80 block font-normal">
                          국{wKor}·수{wMat}·탐{wInq}
                        </span>
                      </div>
                    </div>

                    {/* Gap Status Pill */}
                    <div className="flex items-center justify-between pt-1 border-t border-peach/20">
                      <span className="text-navy-muted font-bold">모의고사 Gap:</span>
                      <span
                        className={`text-[10.5px] font-black px-2 py-0.5 rounded-md border ${
                          isSafe
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-coral/25 text-navy border-coral'
                        }`}
                      >
                        {latestMock ? (
                          isSafe ? `+${Math.abs(gap)}%p 도달 ✅` : `-${Math.abs(gap)}%p 부족 ⚠️`
                        ) : (
                          '모의고사 미등록'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {cards.length === 0 && (
              <div className="bg-white/60 rounded-2xl p-6 text-center text-midnight/40 text-xs border border-dashed border-peach/60 flex flex-col items-center justify-center min-h-[140px]">
                <p>등록된 [{title}] 목표 대학이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => onAddClick(groupKey)}
          className="mt-4 w-full py-2.5 rounded-2xl border-2 border-dashed border-peach/70 text-midnight/70 font-bold text-xs hover:border-coral hover:text-coral hover:bg-white/50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>[{title}] 목표 대학 추가하기</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-peach/30 flex items-center justify-center text-midnight">
          <GraduationCap className="w-4 h-4 text-midnight" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-midnight tracking-tight">
            정시 가 / 나 / 다군 3개 군 포트폴리오
          </h3>
          <p className="text-xs text-midnight/60">
            군별 목표 대학 배치 및 대학별 수능 반영 비율(가중치) 맞춤 실시간 Gap 비교
          </p>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderGroupColumn('가군', 'ga', gaCards, 'bg-peach/50 text-navy', 'border-peach/60 bg-cream/30')}
        {renderGroupColumn('나군', 'na', naCards, 'bg-pastel-sky/50 text-navy', 'border-pastel-sky/60 bg-pastel-sky/10')}
        {renderGroupColumn('다군', 'da', daCards, 'bg-amber-100 text-amber-900', 'border-amber-200 bg-amber-50/40')}
      </div>
    </div>
  );
}
