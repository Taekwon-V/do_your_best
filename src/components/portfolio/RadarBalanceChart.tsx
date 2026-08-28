'use client';

import React from 'react';
import { SemesterCourseGrade, MockExamRecord } from '@/types/admissions';
import { Activity, Zap } from 'lucide-react';

interface RadarBalanceChartProps {
  courses: SemesterCourseGrade[];
  latestMock: MockExamRecord | null;
  currentGPA: number;
}

export default function RadarBalanceChart({
  courses = [],
  latestMock,
  currentGPA,
}: RadarBalanceChartProps) {
  // 6 Axis Metrics (0 ~ 100 Scale)
  const koreanCSAT = latestMock?.scores.korean.percentile ?? 80;
  const mathCSAT = latestMock?.scores.math.percentile ?? 85;
  const engGrade = latestMock?.scores.english.grade ?? 2;
  const engCSAT = engGrade === 1 ? 100 : engGrade === 2 ? 85 : engGrade === 3 ? 70 : 50;
  
  const socPct = latestMock?.scores.integratedSocial.percentile ?? 80;
  const sciPct = latestMock?.scores.integratedScience.percentile ?? 80;
  const inquiryCSAT = (socPct + sciPct) / 2;

  // GPA 5등급제 to 100 scale: 1.0 -> 100, 2.0 -> 80, 2.5 -> 70, 3.0 -> 60, 5.0 -> 20
  const overallGPA = Math.max(20, Math.min(100, 100 - (currentGPA - 1.0) * 20));

  // Major GPA (국어, 수학)
  const majorCourses = courses.filter((c) => c.category === '국어' || c.category === '수학');
  const majorGPAVal = majorCourses.length > 0
    ? majorCourses.reduce((acc, c) => acc + c.rankGrade * c.unitCount, 0) /
      majorCourses.reduce((acc, c) => acc + c.unitCount, 0)
    : currentGPA;
  const majorGPA = Math.max(20, Math.min(100, 100 - (majorGPAVal - 1.0) * 20));

  const metrics = [
    { label: '국어 (수능)', value: koreanCSAT },
    { label: '수학 (수능)', value: mathCSAT },
    { label: '영어 (수능)', value: engCSAT },
    { label: '탐구 (수능)', value: inquiryCSAT },
    { label: '전교과 (내신)', value: overallGPA },
    { label: '국·수 (내신)', value: majorGPA },
  ];

  // SVG Radar Dimensions
  const size = 300;
  const center = size / 2;
  const radius = 95;
  const totalAxes = metrics.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Helper for polygon points
  const getCoordinates = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const angle = index * angleSlice - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = metrics
    .map((m, idx) => {
      const { x, y } = getCoordinates(m.value, idx);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPolygonPoints = metrics
    .map((_, idx) => {
      const { x, y } = getCoordinates(90, idx); // 90% target benchmark
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
            <Activity className="w-4 h-4 text-coral" />
          </div>
          <h3 className="font-bold text-midnight text-base sm:text-lg">
            6대 대입 핵심 역량 밸런스 레이더
          </h3>
        </div>
        <p className="text-xs text-midnight/60">
          수능(국·수·영·탐)과 내신(전교과·주요과목)의 균형도 및 강점/보완점 진단
        </p>
      </div>

      {/* SVG Radar Chart */}
      <div className="relative flex items-center justify-center my-2 select-none">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] h-auto">
          {/* Background Concentric Webs (25%, 50%, 75%, 100%) */}
          {[25, 50, 75, 100].map((level) => {
            const levelPoints = Array.from({ length: totalAxes })
              .map((_, idx) => {
                const { x, y } = getCoordinates(level, idx);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={level === 100 ? 'none' : '3 3'}
              />
            );
          })}

          {/* Axis Radial Lines */}
          {Array.from({ length: totalAxes }).map((_, idx) => {
            const { x, y } = getCoordinates(100, idx);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* Target Benchmark Line (Gold Dashed) */}
          <polygon
            points={targetPolygonPoints}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Student's Actual Area Polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(245, 130, 174, 0.4)"
            stroke="#f582ae"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {metrics.map((m, idx) => {
            const { x, y } = getCoordinates(m.value, idx);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="4.5"
                fill="#172c66"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* Axis Labels */}
          {metrics.map((m, idx) => {
            const labelCoord = getCoordinates(122, idx);
            return (
              <text
                key={idx}
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#001858"
              >
                {m.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend & Insight */}
      <div className="bg-cream/60 rounded-2xl p-3 border border-peach/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-midnight font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block" />
            <span>현재 성취도</span>
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>목표선 (90%)</span>
          </span>
        </div>
        <span className="font-bold text-coral text-[11px]">
          수학 수능({mathCSAT}%) 강점 우세 ⭐
        </span>
      </div>
    </div>
  );
}
