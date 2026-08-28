'use client';

import React from 'react';
import { TargetUniversity, SusiCategory, MockExamRecord } from '@/types/admissions';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface Susi6CardGridProps {
  targetUniversities: TargetUniversity[];
  currentGPA: number;
  latestMock: MockExamRecord | null;
  onAddClick: (category: SusiCategory) => void;
  onEditClick: (target: TargetUniversity) => void;
  onDeleteClick: (targetId: string) => void;
}

export default function Susi6CardGrid({
  targetUniversities = [],
  currentGPA,
  latestMock,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: Susi6CardGridProps) {
  const susiCards = targetUniversities.filter((t) => t.type === 'susi');

  const reachCards = susiCards.filter((t) => t.susiCategory === 'reach');
  const targetCards = susiCards.filter((t) => t.susiCategory === 'target');
  const safeCards = susiCards.filter((t) => t.susiCategory === 'safe');

  // Evaluate Minimum CSAT Status
  const evaluateCsatRequirement = (target: TargetUniversity) => {
    const req = target.susiRequirements?.minimumCsatRequirement;
    if (!req || !req.requiredSubjectsCount || req.requiredSubjectsCount === 0) {
      return { status: 'none', label: '수능최저 없음 ✨', color: 'text-navy font-bold bg-cream border border-navy/20' };
    }

    if (!latestMock) {
      return { status: 'unknown', label: '모의고사 기록 필요', color: 'text-navy-muted font-bold bg-cream/70 border border-navy/20' };
    }

    const s = latestMock.scores;
    const grades = [
      s.korean.grade ?? 5,
      s.math.grade ?? 5,
      s.english.grade ?? 5,
      s.integratedScience.grade ?? 5,
      s.integratedSocial.grade ?? 5,
    ].sort((a, b) => a - b);

    const bestSum = grades.slice(0, req.requiredSubjectsCount).reduce((acc, g) => acc + g, 0);

    if (bestSum <= req.sumGradeLimit) {
      return { status: 'pass', label: `최저 충족 (${bestSum} <= ${req.sumGradeLimit}) ✅`, color: 'text-emerald-900 font-black bg-emerald-100 border border-emerald-400' };
    } else if (bestSum === req.sumGradeLimit + 1) {
      return { status: 'warning', label: `최저 위험 (+1등급 필요) ⚠️`, color: 'text-amber-950 font-black bg-amber-100 border border-amber-400' };
    } else {
      return { status: 'fail', label: `최저 미달 (${bestSum} > ${req.sumGradeLimit}) ❌`, color: 'text-red-950 font-black bg-red-100 border border-red-400' };
    }
  };

  // Evaluate GPA acceptance probability badge
  const evaluateGpaStatus = (expectedCut: number = 1.5) => {
    const diff = currentGPA - expectedCut;
    if (diff <= -0.15) {
      return { label: '안정권 🟢', color: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' };
    } else if (diff <= 0.10) {
      return { label: '적정권 🟡', color: 'bg-amber-100 text-amber-950 border-amber-400 font-bold' };
    } else if (diff <= 0.35) {
      return { label: '소신권 🟠', color: 'bg-orange-100 text-orange-950 border-orange-400 font-bold' };
    } else {
      return { label: '상향도전 🔴', color: 'bg-red-100 text-red-950 border-red-400 font-bold' };
    }
  };

  const renderCategoryColumn = (
    title: string,
    categoryKey: SusiCategory,
    cards: TargetUniversity[],
    badgeStyle: string,
    containerBorder: string
  ) => {
    return (
      <div className={`rounded-3xl p-4 sm:p-5 border-2 ${containerBorder} flex flex-col justify-between`}>
        <div>
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-peach/30">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${badgeStyle}`}>
              {title}
            </span>
            <span className="text-xs font-bold text-midnight/70">
              {cards.length} / 2장
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {cards.map((target) => {
              const expectedCut = target.susiRequirements?.expectedCutoffGrade ?? 1.5;
              const gpaEval = evaluateGpaStatus(expectedCut);
              const csatEval = evaluateCsatRequirement(target);

              return (
                <div
                  key={target.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-peach/50 shadow-sm hover:shadow-md transition-all space-y-2.5"
                >
                  {/* Univ Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-midnight text-sm sm:text-base">
                          {target.universityName}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-peach/40 text-navy">
                          {target.admissionType}
                        </span>
                      </div>
                      <p className="text-xs text-midnight/70 font-medium mt-0.5">
                        {target.departmentName}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
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

                  {/* Cutoff & Diagnostics */}
                  <div className="pt-2 border-t border-peach/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-midnight/70">합격 예상 컷:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-midnight">{expectedCut.toFixed(2)}등급</strong>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${gpaEval.color}`}>
                          {gpaEval.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5 pt-1">
                      <span className="text-[11px] text-midnight/60">수능최저 기준:</span>
                      <p className="text-[11px] text-midnight/80 font-medium truncate">
                        {target.susiRequirements?.minimumCsatRequirement?.description || '수능최저 없음'}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-lg ${csatEval.color}`}>
                          {csatEval.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Slots */}
            {cards.length < 2 && (
              <button
                onClick={() => onAddClick(categoryKey)}
                className="w-full py-4 border-2 border-dashed border-peach/70 hover:border-navy rounded-2xl bg-white/40 hover:bg-white text-midnight/60 hover:text-midnight font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ {title.split(' ')[0]} 카드 슬롯 등록 ({cards.length}/2)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-peach/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
            <Layers className="w-4 h-4 text-coral" />
          </div>
          <div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              수시 6장 황금 밸런스 포트폴리오 (2-2-2 전략)
            </h3>
            <p className="text-xs text-midnight/60">
              소신 2장 + 적정 2장 + 안정 2장 구성 및 실시간 내신·수능최저 진단 (등록: {susiCards.length}/6장)
            </p>
          </div>
        </div>
      </div>

      {/* 3 Category Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 소신 2장 (Reach) */}
        {renderCategoryColumn(
          '소신 / 상향 (2장)',
          'reach',
          reachCards,
          'bg-red-100 text-red-700 border-red-300',
          'bg-red-50/40 border-red-200'
        )}

        {/* 적정 2장 (Target) */}
        {renderCategoryColumn(
          '적정 지원 (2장)',
          'target',
          targetCards,
          'bg-amber-100 text-amber-800 border-amber-300',
          'bg-amber-50/40 border-amber-200'
        )}

        {/* 안정 2장 (Safe) */}
        {renderCategoryColumn(
          '안정 / 합격권 (2장)',
          'safe',
          safeCards,
          'bg-emerald-100 text-emerald-800 border-emerald-300',
          'bg-emerald-50/40 border-emerald-200'
        )}
      </div>
    </div>
  );
}
