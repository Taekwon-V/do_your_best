'use client';

import React, { useState, useMemo } from 'react';
import { MockExamRecord } from '@/types/admissions';
import { TrendingUp, Award, Filter, Info, Target, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface MockExamChartProps {
  mockExams: MockExamRecord[];
  targetPercentile?: number;
  targetUniversityName?: string;
  targetWeights?: {
    korean: number;
    math: number;
    inquiry: number;
    english?: number;
    history?: number;
  };
}

type SubjectFilter = 'all' | 'weighted' | 'korean' | 'math' | 'social' | 'science';

export default function MockExamChart({
  mockExams = [],
  targetPercentile = 85.0,
  targetUniversityName = '인하대학교 수학교육과',
  targetWeights = { korean: 25, math: 40, inquiry: 25, english: 0, history: 0 },
}: MockExamChartProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort exams chronologically by date
  const sortedExams = useMemo(() => {
    return [...mockExams].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(a.examDate).getTime()
    );
  }, [mockExams]);

  // Chart dimensions
  const width = 640;
  const height = 280;
  const padding = { top: 35, right: 45, bottom: 50, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // X coordinate calculation
  const getX = (index: number) => {
    if (sortedExams.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (sortedExams.length - 1)) * graphWidth;
  };

  // Y coordinate calculation for percentile (0 ~ 100)
  const getY = (percentile: number = 0) => {
    const clamped = Math.max(0, Math.min(100, percentile));
    return padding.top + graphHeight - (clamped / 100) * graphHeight;
  };

  // Compute university-weighted percentile for an exam
  const getWeightedPercentile = (exam: MockExamRecord) => {
    const mathPct = exam.scores.math.percentile ?? 0;
    const koreanPct = exam.scores.korean.percentile ?? 0;
    const socPct = exam.scores.integratedSocial.percentile ?? 0;
    const sciPct = exam.scores.integratedScience.percentile ?? 0;
    const tamguPct = (socPct + sciPct) / 2;

    const wKor = targetWeights.korean || 25;
    const wMat = targetWeights.math || 40;
    const wInq = targetWeights.inquiry || 25;
    const totalW = wKor + wMat + wInq || 100;

    const weighted = (koreanPct * wKor + mathPct * wMat + tamguPct * wInq) / totalW;
    return Number(weighted.toFixed(1));
  };

  // Generate SVG path for a given subject metric
  const generatePath = (getVal: (exam: MockExamRecord) => number | undefined) => {
    if (sortedExams.length === 0) return '';
    const points = sortedExams.map((exam, idx) => ({
      x: getX(idx),
      y: getY(getVal(exam) ?? 0),
    }));

    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  };

  const koreanPath = generatePath((e) => e.scores.korean.percentile);
  const mathPath = generatePath((e) => e.scores.math.percentile);
  const socialPath = generatePath((e) => e.scores.integratedSocial.percentile);
  const sciencePath = generatePath((e) => e.scores.integratedScience.percentile);
  const weightedPath = generatePath((e) => getWeightedPercentile(e));

  const targetY = getY(targetPercentile);

  if (sortedExams.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-peach/50 flex flex-col items-center justify-center min-h-[320px] text-center">
        <Info className="w-10 h-10 text-midnight/30 mb-2" />
        <p className="text-midnight/70 font-medium">등록된 모의고사 성적이 없습니다.</p>
        <p className="text-xs text-midnight/50 mt-1">
          하단의 [새 모의고사 성적 추가] 버튼을 눌러 성적을 등록해 보세요.
        </p>
      </div>
    );
  }

  const activeExam = hoveredIndex !== null ? sortedExams[hoveredIndex] : sortedExams[sortedExams.length - 1];
  const activeWeightedPct = getWeightedPercentile(activeExam);
  const activeGap = Number((activeWeightedPct - targetPercentile).toFixed(1));
  const isActiveSafe = activeGap >= 0;

  const wKor = targetWeights.korean || 25;
  const wMat = targetWeights.math || 40;
  const wInq = targetWeights.inquiry || 25;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 flex flex-col justify-between space-y-3.5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
              <TrendingUp className="w-4 h-4 text-midnight" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-midnight flex items-center gap-1.5 flex-wrap">
              <span>2028 통합수능 시계열 백분위 추이</span>
            </h3>
          </div>
          <p className="text-xs text-midnight/60 mt-0.5">
            과목별 성적과 <strong className="text-navy font-black">[{targetUniversityName}]</strong> 정시 반영비 반영 맞춤 환산선
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-midnight text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            전체
          </button>

          {/* 🌟 Special Target-Weighted Filter Button */}
          <button
            onClick={() => setActiveFilter('weighted')}
            className={`text-xs px-3 py-1 rounded-full font-black flex items-center gap-1 transition-all ${
              activeFilter === 'weighted'
                ? 'bg-indigo-600 text-white shadow-retro-sm scale-105 ring-2 ring-indigo-400'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>🎯 대학 환산 ({activeWeightedPct}%)</span>
          </button>

          <button
            onClick={() => setActiveFilter('math')}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeFilter === 'math'
                ? 'bg-midnight text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            수학 ({wMat}%)
          </button>

          <button
            onClick={() => setActiveFilter('korean')}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeFilter === 'korean'
                ? 'bg-midnight text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            국어 ({wKor}%)
          </button>

          <button
            onClick={() => setActiveFilter('science')}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeFilter === 'science'
                ? 'bg-midnight text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            통합과학
          </button>

          <button
            onClick={() => setActiveFilter('social')}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeFilter === 'social'
                ? 'bg-midnight text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            통합사회
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart Area */}
      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="text-[10.5px] text-navy-muted sm:hidden pb-1 flex items-center justify-end gap-1">
          <span>← 좌우로 스크롤하여 전체 회차 보기 →</span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[520px] select-none"
        >
          <defs>
            {/* Glow filter for university weighted line */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines (0, 25, 50, 75, 100) */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="500"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Target Goal Line (Dashed Golden/Amber) */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={width - padding.right}
            y2={targetY}
            stroke="#d97706"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <text
            x={width - padding.right}
            y={targetY - 8}
            textAnchor="end"
            fontSize="10.5"
            fontWeight="bold"
            fill="#b45309"
          >
            목표선 {targetPercentile}% ({targetUniversityName})
          </text>

          {/* Lines by subject */}
          {(activeFilter === 'all' || activeFilter === 'social') && (
            <path
              d={socialPath}
              fill="none"
              stroke="#d97706"
              strokeWidth={activeFilter === 'social' ? '3.5' : '1.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.45' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'science') && (
            <path
              d={sciencePath}
              fill="none"
              stroke="#059669"
              strokeWidth={activeFilter === 'science' ? '3.5' : '1.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.45' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'korean') && (
            <path
              d={koreanPath}
              fill="none"
              stroke="#172c66"
              strokeWidth={activeFilter === 'korean' ? '3.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.6' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'math') && (
            <path
              d={mathPath}
              fill="none"
              stroke="#f582ae"
              strokeWidth={activeFilter === 'math' ? '4' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.65' : '1'}
            />
          )}

          {/* 🌟 🎯 SPECIAL HIGHLIGHTED: Target-Weighted Line (Indigo/Violet) */}
          {(activeFilter === 'all' || activeFilter === 'weighted') && (
            <path
              d={weightedPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth={activeFilter === 'weighted' ? '4.5' : '3.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}

          {/* Interactive Data Points & Hover Triggers */}
          {sortedExams.map((exam, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;
            const weightedScore = getWeightedPercentile(exam);
            const weightedY = getY(weightedScore);
            const examGap = Number((weightedScore - targetPercentile).toFixed(1));
            const isExamSafe = examGap >= 0;

            return (
              <g
                key={exam.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Subject Dots (Subtle in 'all' view) */}
                {(activeFilter === 'all' || activeFilter === 'math') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.math.percentile)}
                    r={isHovered ? 5 : 3.5}
                    fill="#f582ae"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity={activeFilter === 'all' ? '0.7' : '1'}
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'korean') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.korean.percentile)}
                    r={isHovered ? 4.5 : 3}
                    fill="#172c66"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity={activeFilter === 'all' ? '0.7' : '1'}
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'science') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.integratedScience.percentile)}
                    r={3}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.6"
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'social') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.integratedSocial.percentile)}
                    r={3}
                    fill="#d97706"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.6"
                    className="transition-all"
                  />
                )}

                {/* 🌟 🎯 SPECIAL HIGHLIGHTED: Target-Weighted Point (Large Pulsing Diamond/Circle) */}
                {(activeFilter === 'all' || activeFilter === 'weighted') && (
                  <g>
                    {/* Outer glow ring */}
                    <circle
                      cx={x}
                      cy={weightedY}
                      r={isHovered ? 10 : 7.5}
                      fill="#6366f1"
                      fillOpacity="0.25"
                    />
                    {/* Inner core node */}
                    <circle
                      cx={x}
                      cy={weightedY}
                      r={isHovered ? 6 : 4.5}
                      fill="#4f46e5"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Floating score badge over node */}
                    <rect
                      x={x - 22}
                      y={weightedY - 24}
                      width={44}
                      height={16}
                      rx={8}
                      fill="#312e81"
                      stroke="#818cf8"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={weightedY - 12.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="900"
                      fill="#ffffff"
                    >
                      {weightedScore}%
                    </text>
                  </g>
                )}

                {/* X-axis Label (Exam Name / Date) */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? '#001858' : '#475569'}
                >
                  {exam.examName.replace(/20\d\d년\s*/, '')}
                </text>
                <text
                  x={x}
                  y={height - padding.bottom + 32}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#94a3b8"
                >
                  {exam.examDate.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 🎯 Prominent Target-Weighted Score & Gap Calculation Bar */}
      {activeExam && (
        <div className="bg-gradient-to-r from-indigo-900 to-navy text-cream rounded-2xl p-3.5 border-2 border-indigo-500/40 shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-white">
                    [{targetUniversityName}] 대학 맞춤 환산 백분위:
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-300">
                    {activeWeightedPct}%
                  </span>
                </div>
                <p className="text-[11px] text-cream/70">
                  반영 비율: 국어 {wKor}% + 수학 {wMat}% + 탐구 {wInq}%
                </p>
              </div>
            </div>

            {/* Target comparison badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm ${
                  isActiveSafe
                    ? 'bg-emerald-400 text-navy border border-emerald-300'
                    : 'bg-coral text-navy border border-coral-hover'
                }`}
              >
                {isActiveSafe ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-navy" />
                    <span>목표 컷({targetPercentile}%) 대비 +{Math.abs(activeGap)}%p 도달 ✅</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-navy" />
                    <span>목표 컷({targetPercentile}%) 대비 {Math.abs(activeGap)}%p 부족 ⚠️</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Subject breakdown pill strip */}
          <div className="pt-2 border-t border-white/15 flex items-center gap-3 text-[11px] text-cream/80 flex-wrap">
            <span>
              국어({wKor}%): <strong className="text-white font-bold">{activeExam.scores.korean.percentile}%</strong>
            </span>
            <span>•</span>
            <span className="text-amber-200">
              수학({wMat}%): <strong className="text-amber-300 font-bold">{activeExam.scores.math.percentile}%</strong>
            </span>
            <span>•</span>
            <span>
              탐구({wInq}%): <strong className="text-white font-bold">{((activeExam.scores.integratedScience.percentile ?? 0) + (activeExam.scores.integratedSocial.percentile ?? 0)) / 2}%</strong>
            </span>
            <span>•</span>
            <span>
              영어: <strong className="text-white font-bold">{activeExam.scores.english.grade}등급</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
