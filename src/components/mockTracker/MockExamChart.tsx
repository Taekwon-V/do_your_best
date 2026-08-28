'use client';

import React, { useState, useMemo } from 'react';
import { MockExamRecord } from '@/types/admissions';
import { TrendingUp, Award, Filter, Info } from 'lucide-react';

interface MockExamChartProps {
  mockExams: MockExamRecord[];
  targetPercentile?: number;
  targetUniversityName?: string;
}

type SubjectFilter = 'all' | 'korean' | 'math' | 'social' | 'science';

export default function MockExamChart({
  mockExams = [],
  targetPercentile = 85.0,
  targetUniversityName = '인하대 수학교육과',
}: MockExamChartProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort exams chronologically by date
  const sortedExams = useMemo(() => {
    return [...mockExams].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
  }, [mockExams]);

  // Chart dimensions
  const width = 600;
  const height = 260;
  const padding = { top: 25, right: 35, bottom: 45, left: 45 };
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

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 flex flex-col justify-between">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
              <TrendingUp className="w-4 h-4 text-midnight" />
            </div>
            <h3 className="text-lg font-bold text-midnight">
              2028 통합수능 시계열 백분위 추이
            </h3>
          </div>
          <p className="text-xs text-midnight/60 mt-0.5">
            시험 회차별 백분위 성장 궤적과 목표선({targetUniversityName} {targetPercentile}%)
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all', label: '전체' },
            { key: 'math', label: '수학', color: '#f582ae' },
            { key: 'korean', label: '국어', color: '#172c66' },
            { key: 'science', label: '통합과학', color: '#059669' },
            { key: 'social', label: '통합사회', color: '#d97706' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key as SubjectFilter)}
              className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                activeFilter === f.key
                  ? 'bg-midnight text-cream shadow-sm scale-105'
                  : 'bg-cream text-midnight/70 hover:bg-peach/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Chart Area */}
      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="text-[10.5px] text-navy-muted sm:hidden pb-1 flex items-center justify-end gap-1">
          <span>← 좌우로 스크롤하여 전체 회차 보기 →</span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[480px] sm:min-w-[520px] select-none"
        >
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

          {/* Goal Line (Dashed Golden/Coral) */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={width - padding.right}
            y2={targetY}
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text
            x={width - padding.right}
            y={targetY - 6}
            textAnchor="end"
            fontSize="10"
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
              strokeWidth={activeFilter === 'social' ? '3.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.75' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'science') && (
            <path
              d={sciencePath}
              fill="none"
              stroke="#059669"
              strokeWidth={activeFilter === 'science' ? '3.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.75' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'korean') && (
            <path
              d={koreanPath}
              fill="none"
              stroke="#172c66"
              strokeWidth={activeFilter === 'korean' ? '3.5' : '2.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeFilter === 'all' ? '0.85' : '1'}
            />
          )}

          {(activeFilter === 'all' || activeFilter === 'math') && (
            <path
              d={mathPath}
              fill="none"
              stroke="#f582ae"
              strokeWidth={activeFilter === 'math' ? '4' : '3'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points & Hover Triggers */}
          {sortedExams.map((exam, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;

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

                {/* Subject Dots */}
                {(activeFilter === 'all' || activeFilter === 'math') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.math.percentile)}
                    r={isHovered ? 6 : 4}
                    fill="#f582ae"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'korean') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.korean.percentile)}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#172c66"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'science') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.integratedScience.percentile)}
                    r={isHovered ? 5 : 3}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                )}
                {(activeFilter === 'all' || activeFilter === 'social') && (
                  <circle
                    cx={x}
                    cy={getY(exam.scores.integratedSocial.percentile)}
                    r={isHovered ? 5 : 3}
                    fill="#d97706"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                )}

                {/* X-axis Label (Exam Name / Date) */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? '#001858' : '#64748b'}
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

      {/* Dynamic Summary Strip at Bottom of Chart */}
      {activeExam && (
        <div className="mt-2 bg-cream/90 rounded-2xl p-3.5 border-2 border-navy/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-black text-navy flex items-center gap-1.5">
            <Award className="w-4 h-4 text-coral shrink-0" />
            <span className="break-keep">{activeExam.examName}</span>
            <span className="text-[11px] font-bold text-navy-muted">
              ({activeExam.examDate})
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-navy font-bold">
              국어: <strong className="text-navy font-black">{activeExam.scores.korean.percentile}%</strong> ({activeExam.scores.korean.grade}등급)
            </span>
            <span className="text-coral-hover font-black">
              수학: <strong>{activeExam.scores.math.percentile}%</strong> ({activeExam.scores.math.grade}등급)
            </span>
            <span className="text-navy font-bold">
              영어: <strong className="font-black">{activeExam.scores.english.grade}등급</strong>
            </span>
            <span className="text-emerald-800 font-bold">
              통과: <strong>{activeExam.scores.integratedScience.percentile}%</strong>
            </span>
            <span className="text-amber-800 font-bold">
              통사: <strong>{activeExam.scores.integratedSocial.percentile}%</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
