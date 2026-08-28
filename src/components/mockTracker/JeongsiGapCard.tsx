'use client';

import React, { useState, useMemo } from 'react';
import { MockExamRecord } from '@/types/admissions';
import { Target, Zap, CheckCircle2, AlertCircle, ArrowUpRight, ChevronDown } from 'lucide-react';

interface TargetOption {
  id: string;
  univName: string;
  deptName: string;
  percentileCut: number;
  group: '가군' | '나군' | '다군';
  koreanWeight: number;
  mathWeight: number;
  tamguWeight: number;
}

const DEFAULT_TARGETS: TargetOption[] = [
  { id: 't1', univName: '인하대학교', deptName: '수학교육과', percentileCut: 85.0, group: '나군', koreanWeight: 20, mathWeight: 40, tamguWeight: 30 },
  { id: 't2', univName: '인하대학교', deptName: '컴퓨터공학과', percentileCut: 84.5, group: '가군', koreanWeight: 25, mathWeight: 35, tamguWeight: 30 },
  { id: 't3', univName: '인하대학교', deptName: '전기전자공학부', percentileCut: 83.5, group: '나군', koreanWeight: 25, mathWeight: 35, tamguWeight: 30 },
  { id: 't4', univName: '국립인천대학교', deptName: '수학교육과', percentileCut: 80.3, group: '나군', koreanWeight: 25, mathWeight: 40, tamguWeight: 25 },
  { id: 't5', univName: '국립인천대학교', deptName: '컴퓨터공학부', percentileCut: 79.5, group: '가군', koreanWeight: 25, mathWeight: 35, tamguWeight: 30 },
  { id: 't6', univName: '국립인천대학교', deptName: '영어교육과', percentileCut: 84.6, group: '나군', koreanWeight: 35, mathWeight: 25, tamguWeight: 30 },
  { id: 't7', univName: '국립인천대학교', deptName: '경영학부', percentileCut: 78.5, group: '다군', koreanWeight: 35, mathWeight: 30, tamguWeight: 25 },
  { id: 't8', univName: '중앙대학교', deptName: '소프트웨어학부', percentileCut: 91.5, group: '다군', koreanWeight: 25, mathWeight: 40, tamguWeight: 35 },
  { id: 't9', univName: '중앙대학교', deptName: '경영학부', percentileCut: 90.0, group: '다군', koreanWeight: 35, mathWeight: 40, tamguWeight: 25 },
];

interface JeongsiGapCardProps {
  mockExams: MockExamRecord[];
  onSelectTarget?: (target: TargetOption) => void;
}

export default function JeongsiGapCard({
  mockExams = [],
  onSelectTarget,
}: JeongsiGapCardProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('t1');

  const selectedTarget = useMemo(() => {
    return DEFAULT_TARGETS.find((t) => t.id === selectedTargetId) || DEFAULT_TARGETS[0];
  }, [selectedTargetId]);

  // Latest mock exam
  const latestExam = useMemo(() => {
    if (mockExams.length === 0) return null;
    return [...mockExams].sort(
      (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
    )[0];
  }, [mockExams]);

  // Calculate student's weighted percentile based on the university's formula
  const studentMetrics = useMemo(() => {
    if (!latestExam) return { weightedPercentile: 0, mathPct: 0, koreanPct: 0, tamguPct: 0, engGrade: 3 };

    const mathPct = latestExam.scores.math.percentile ?? 0;
    const koreanPct = latestExam.scores.korean.percentile ?? 0;
    const socPct = latestExam.scores.integratedSocial.percentile ?? 0;
    const sciPct = latestExam.scores.integratedScience.percentile ?? 0;
    const tamguPct = (socPct + sciPct) / 2;
    const engGrade = latestExam.scores.english.grade ?? 2;

    const totalWeight = selectedTarget.koreanWeight + selectedTarget.mathWeight + selectedTarget.tamguWeight;
    const weighted = (
      koreanPct * (selectedTarget.koreanWeight / totalWeight) +
      mathPct * (selectedTarget.mathWeight / totalWeight) +
      tamguPct * (selectedTarget.tamguWeight / totalWeight)
    );

    return {
      weightedPercentile: Number(weighted.toFixed(1)),
      mathPct,
      koreanPct,
      tamguPct: Number(tamguPct.toFixed(1)),
      engGrade,
    };
  }, [latestExam, selectedTarget]);

  const gap = Number((studentMetrics.weightedPercentile - selectedTarget.percentileCut).toFixed(1));
  const isSafe = gap >= 0;

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedTargetId(newId);
    const target = DEFAULT_TARGETS.find((t) => t.id === newId);
    if (target && onSelectTarget) {
      onSelectTarget(target);
    }
  };

  return (
    <div className="bg-midnight rounded-3xl p-5 sm:p-6 text-cream shadow-md flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-coral/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
              <Target className="w-4 h-4 text-coral" />
            </div>
            <h3 className="font-bold text-cream text-base sm:text-lg">
              정시 목표 대학 Gap 분석
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cream/10 text-cream/70 font-medium">
            2026 수능 실측 입결 기준
          </span>
        </div>

        {/* Target University Dropdown Selector */}
        <div className="relative mb-4">
          <select
            value={selectedTargetId}
            onChange={handleTargetChange}
            className="w-full appearance-none bg-cream/10 border border-cream/20 rounded-2xl px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-cream focus:outline-none focus:ring-2 focus:ring-coral transition-all cursor-pointer"
          >
            {DEFAULT_TARGETS.map((t) => (
              <option key={t.id} value={t.id} className="text-midnight bg-white">
                [{t.group}] {t.univName} {t.deptName} (70% 컷: {t.percentileCut}%)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-cream/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Comparison Scores Box */}
        <div className="bg-cream/5 rounded-2xl p-4 border border-cream/10 mb-4">
          <div className="flex items-center justify-between text-center divide-x divide-cream/10">
            <div className="flex-1 px-2">
              <p className="text-[11px] text-cream/60 mb-0.5">목표 대학 70% Cut</p>
              <p className="text-xl sm:text-2xl font-black text-amber-300">
                {selectedTarget.percentileCut}%
              </p>
              <p className="text-[10px] text-cream/50 mt-0.5">
                {selectedTarget.univName}
              </p>
            </div>

            <div className="flex-1 px-2">
              <p className="text-[11px] text-cream/60 mb-0.5">최근 모의고사 환산</p>
              <p className="text-xl sm:text-2xl font-black text-pastel-sky">
                {latestExam ? `${studentMetrics.weightedPercentile}%` : '-'}
              </p>
              <p className="text-[10px] text-cream/50 mt-0.5">
                {latestExam ? latestExam.examName.replace(/20\d\d년\s*/, '') : '시험 미등록'}
              </p>
            </div>
          </div>

          {/* Gap Status Pill */}
          <div className="mt-3.5 pt-3 border-t border-cream/10 flex items-center justify-between">
            <span className="text-xs text-cream/70 font-medium">목표 격차(Gap):</span>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                isSafe
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-coral/20 text-coral border border-coral/30'
              }`}
            >
              {isSafe ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>+{Math.abs(gap)}%p 안정권 도달 ✅</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{Math.abs(gap)}%p 점수 부족 ⚠️</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Strategy Coaching Box */}
      <div className="bg-coral/10 rounded-2xl p-3.5 border border-coral/20">
        <div className="flex items-center gap-1.5 mb-1.5 text-coral text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>점수 도약을 위한 우선순위 처방전</span>
        </div>
        <p className="text-[11.5px] text-cream/80 leading-relaxed">
          {isSafe ? (
            <>
              현재 모의고사 성적이 <strong className="text-cream">{selectedTarget.deptName}</strong> 안정권입니다! 수능 당일까지 수학 고난도 킬러 문제 풀이 감각을 유지하세요.
            </>
          ) : (
            <>
              가장 반영비가 높은 <strong className="text-coral">수학(40%)</strong>에서 4점짜리 1문제를 더 맞히면 백분위가 약 <strong className="text-cream">+3~5%p 상승</strong>하여 목표 컷에 즉시 도달할 수 있습니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
