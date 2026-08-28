'use client';

import React, { useState, useMemo } from 'react';
import { MockExamRecord } from '@/types/admissions';
import { TrendingUp, Award, Filter, Info, Target, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface MockExamChartProps {
  mockExams?: MockExamRecord[];
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

type SubjectFilter = 'all' | 'math' | 'korean' | 'science' | 'social';

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
    if (!mockExams || mockExams.length === 0) return [];
    return [...mockExams].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
  }, [mockExams]);

  // Chart dimensions
  const width = 640;
  const height = 280;
  const padding = { top: 38, right: 35, bottom: 50, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // X coordinate calculation with generous breathing room (중앙에 여유롭게 배치)
  const getX = (index: number) => {
    const count = sortedExams.length;
    if (count <= 1) return padding.left + graphWidth / 2;

    const horizontalMargin = 95;
    const availableWidth = graphWidth - horizontalMargin * 2;
    return padding.left + horizontalMargin + (index / (count - 1)) * availableWidth;
  };

  // Y coordinate calculation for percentile (0 ~ 100)
  const getY = (percentile: number = 0) => {
    const clamped = Math.max(0, Math.min(100, Number.isFinite(percentile) ? percentile : 0));
    return padding.top + graphHeight - (clamped / 100) * graphHeight;
  };

  // Compute university-weighted percentile for an exam (with safe null-checks)
  const getWeightedPercentile = (exam?: MockExamRecord | null) => {
    if (!exam || !exam.scores) return 0;

    const mathPct = exam.scores.math?.percentile ?? 0;
    const koreanPct = exam.scores.korean?.percentile ?? 0;
    const socPct = exam.scores.integratedSocial?.percentile ?? 0;
    const sciPct = exam.scores.integratedScience?.percentile ?? 0;
    const tamguPct = (socPct + sciPct) / 2;

    const wKor = targetWeights?.korean || 25;
    const wMat = targetWeights?.math || 40;
    const wInq = targetWeights?.inquiry || 25;
    const totalW = wKor + wMat + wInq || 100;

    const weighted = (koreanPct * wKor + mathPct * wMat + tamguPct * wInq) / totalW;
    return Number(weighted.toFixed(1));
  };

  // Generate SVG path for a given metric
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

  const weightedPath = generatePath((e) => getWeightedPercentile(e));
  const mathPath = generatePath((e) => e.scores?.math?.percentile);
  const koreanPath = generatePath((e) => e.scores?.korean?.percentile);
  const sciencePath = generatePath((e) => e.scores?.integratedScience?.percentile);
  const socialPath = generatePath((e) => e.scores?.integratedSocial?.percentile);

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

  // Safe active exam selection
  const safeHoveredIndex =
    hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < sortedExams.length
      ? hoveredIndex
      : null;
  const activeExam =
    safeHoveredIndex !== null ? sortedExams[safeHoveredIndex] : sortedExams[sortedExams.length - 1];

  const activeWeightedPct = getWeightedPercentile(activeExam);
  const activeGap = Number((activeWeightedPct - targetPercentile).toFixed(1));
  const isActiveSafe = activeGap >= 0;

  const wKor = targetWeights?.korean || 25;
  const wMat = targetWeights?.math || 40;
  const wInq = targetWeights?.inquiry || 25;

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
            <strong className="text-navy font-black">[{targetUniversityName}]</strong> 정시 반영비율(국{wKor}·수{wMat}·탐{wInq}) 맞춤 전체 백분위 성장 궤적
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Main Target-Weighted Overall Button */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs px-3 py-1 rounded-full font-black flex items-center gap-1 transition-all ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-retro-sm scale-105 ring-2 ring-indigo-400'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>🎯 전체 환산 ({activeWeightedPct}%)</span>
          </button>

          <button
            onClick={() => setActiveFilter('math')}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
              activeFilter === 'math'
                ? 'bg-rose-500 text-white shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            수학 ({wMat}%)
          </button>

          <button
            onClick={() => setActiveFilter('korean')}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
              activeFilter === 'korean'
                ? 'bg-navy text-cream shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            국어 ({wKor}%)
          </button>

          <button
            onClick={() => setActiveFilter('science')}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
              activeFilter === 'science'
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'bg-cream text-midnight/70 hover:bg-peach/40'
            }`}
          >
            통합과학
          </button>

          <button
            onClick={() => setActiveFilter('social')}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
              activeFilter === 'social'
                ? 'bg-amber-600 text-white shadow-sm scale-105'
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
            {/* Subtle area gradient under line */}
            <linearGradient id="areaGradientClean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
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
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />

          {/* 🌟 Target Line Pill Badge at Top-Left */}
          <g>
            <rect
              x={padding.left + 4}
              y={targetY - 18}
              width={210}
              height={15}
              rx={7.5}
              fill="#fffbeb"
              stroke="#f59e0b"
              strokeWidth="0.9"
            />
            <text
              x={padding.left + 12}
              y={targetY - 7}
              fontSize="9"
              fontWeight="bold"
              fill="#b45309"
            >
              목표선 {targetPercentile}% ({targetUniversityName})
            </text>
          </g>

          {/* Soft area under main weighted line */}
          {activeFilter === 'all' && sortedExams.length >= 2 && (
            <path
              d={`${weightedPath} L ${getX(sortedExams.length - 1)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`}
              fill="url(#areaGradientClean)"
            />
          )}

          {/* 🌟 🎯 MAIN SINGLE TREND LINE (깔끔한 2.2px 두께) */}
          {activeFilter === 'all' && (
            <path
              d={weightedPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Individual Subject Lines (선택 시에만 단독 표시) */}
          {activeFilter === 'math' && (
            <path
              d={mathPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {activeFilter === 'korean' && (
            <path
              d={koreanPath}
              fill="none"
              stroke="#172c66"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {activeFilter === 'science' && (
            <path
              d={sciencePath}
              fill="none"
              stroke="#059669"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {activeFilter === 'social' && (
            <path
              d={socialPath}
              fill="none"
              stroke="#d97706"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points & Centered Nodes */}
          {sortedExams.map((exam, idx) => {
            const x = getX(idx);
            const isHovered = safeHoveredIndex === idx;

            const weightedScore = getWeightedPercentile(exam);
            const mathScore = exam.scores?.math?.percentile ?? 0;
            const koreanScore = exam.scores?.korean?.percentile ?? 0;
            const sciScore = exam.scores?.integratedScience?.percentile ?? 0;
            const socScore = exam.scores?.integratedSocial?.percentile ?? 0;

            const currentScore =
              activeFilter === 'all'
                ? weightedScore
                : activeFilter === 'math'
                ? mathScore
                : activeFilter === 'korean'
                ? koreanScore
                : activeFilter === 'science'
                ? sciScore
                : socScore;

            const currentY = getY(currentScore);
            const isSafe = currentScore >= targetPercentile;

            return (
              <g
                key={exam.id || `exam-${idx}`}
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
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 🌟 🎯 Clean Score Node */}
                <g>
                  {/* Subtle outer ring on hover */}
                  <circle
                    cx={x}
                    cy={currentY}
                    r={isHovered ? 8 : 6}
                    fill={activeFilter === 'math' ? '#f43f5e' : activeFilter === 'korean' ? '#172c66' : activeFilter === 'science' ? '#059669' : activeFilter === 'social' ? '#d97706' : '#6366f1'}
                    fillOpacity="0.2"
                    className="transition-all"
                  />
                  {/* Inner solid node */}
                  <circle
                    cx={x}
                    cy={currentY}
                    r={4.5}
                    fill={activeFilter === 'math' ? '#f43f5e' : activeFilter === 'korean' ? '#172c66' : activeFilter === 'science' ? '#059669' : activeFilter === 'social' ? '#d97706' : '#4f46e5'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* Floating score badge over node */}
                  <rect
                    x={x - 21}
                    y={currentY - 22}
                    width={42}
                    height={16}
                    rx={8}
                    fill={activeFilter === 'all' ? (isSafe ? '#065f46' : '#1e1b4b') : '#0f172a'}
                    stroke={activeFilter === 'all' ? (isSafe ? '#34d399' : '#818cf8') : '#94a3b8'}
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={currentY - 11}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    {currentScore}%
                  </text>
                </g>

                {/* X-axis Label (Exam Name / Date) */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '900' : '700'}
                  fill={isHovered ? '#001858' : '#334155'}
                >
                  {(exam.examName || '').replace(/20\d\d년\s*/, '')}
                </text>
                <text
                  x={x}
                  y={height - padding.bottom + 32}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#94a3b8"
                >
                  {exam.examDate}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 🎯 Target-Weighted Score & Breakdown Summary Bar */}
      {activeExam && activeExam.scores && (
        <div className="bg-gradient-to-r from-indigo-900 to-navy text-cream rounded-2xl p-3.5 border-2 border-indigo-500/40 shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-white">
                    [{activeExam.examName}] [{targetUniversityName}] 맞춤 환산:
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
              국어({wKor}%): <strong className="text-white font-bold">{activeExam.scores.korean?.percentile ?? '-'}%</strong> ({activeExam.scores.korean?.grade ?? '-'}등급)
            </span>
            <span>•</span>
            <span className="text-amber-200">
              수학({wMat}%): <strong className="text-amber-300 font-bold">{activeExam.scores.math?.percentile ?? '-'}%</strong> ({activeExam.scores.math?.grade ?? '-'}등급)
            </span>
            <span>•</span>
            <span>
              탐구({wInq}%): <strong className="text-white font-bold">{(((activeExam.scores.integratedScience?.percentile ?? 0) + (activeExam.scores.integratedSocial?.percentile ?? 0)) / 2).toFixed(1)}%</strong>
            </span>
            <span>•</span>
            <span>
              영어: <strong className="text-white font-bold">{activeExam.scores.english?.grade ?? '-'}등급</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
