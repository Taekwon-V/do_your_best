'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { MockExamRecord, TargetUniversity } from '@/types/admissions';
import { UNIVERSITY_ADMISSIONS_DB } from '@/data/universityAdmissionsDB';
import { Target, Zap, CheckCircle2, AlertCircle, PlusCircle, ChevronDown, Sparkles, BookmarkPlus } from 'lucide-react';

export interface TargetOption {
  id: string;
  univName: string;
  deptName: string;
  percentileCut: number;
  group: '가군' | '나군' | '다군';
  rawGroup: 'ga' | 'na' | 'da';
  koreanWeight: number;
  mathWeight: number;
  tamguWeight: number;
  isUserTarget: boolean;
}

interface JeongsiGapCardProps {
  mockExams?: MockExamRecord[];
  onSelectTarget?: (target: TargetOption) => void;
}

export default function JeongsiGapCard({
  mockExams = [],
  onSelectTarget,
}: JeongsiGapCardProps) {
  const { activeChild, setActiveTab, addTargetUniversity } = useAdmissions();

  // 1. Convert user's registered Jeongsi targets into TargetOptions
  const userTargets: TargetOption[] = useMemo(() => {
    const jeongsiList = (activeChild?.targetUniversities || []).filter(
      (t) => t.type === 'jeongsi'
    );

    return jeongsiList.map((t) => {
      const rawGrp = t.jeongsiGroup || 'ga';
      const grp = (rawGrp === 'ga' ? '가군' : rawGrp === 'na' ? '나군' : '다군') as '가군' | '나군' | '다군';
      const weights = t.jeongsiRequirements?.subjectWeights || { korean: 25, math: 40, inquiry: 25, english: 0, history: 0 };
      return {
        id: t.id,
        univName: t.universityName,
        deptName: t.departmentName,
        percentileCut: t.jeongsiRequirements?.percentileCutoff ?? 85.0,
        group: grp,
        rawGroup: rawGrp,
        koreanWeight: weights.korean || 25,
        mathWeight: weights.math || 40,
        tamguWeight: weights.inquiry || 25,
        isUserTarget: true,
      };
    });
  }, [activeChild?.targetUniversities]);

  // 2. Fallback / Additional DB Targets grouped by university
  const dbTargetsByUniv = useMemo(() => {
    return UNIVERSITY_ADMISSIONS_DB.map((univ) => {
      const list: TargetOption[] = [];
      univ.departments.forEach((dept) => {
        if (dept.jeongsi) {
          const rawGrp = dept.jeongsi.group || 'ga';
          const grp = (rawGrp === 'ga' ? '가군' : rawGrp === 'na' ? '나군' : '다군') as '가군' | '나군' | '다군';
          list.push({
            id: `db_${univ.univId}_${dept.deptName}`,
            univName: univ.univName,
            deptName: dept.deptName,
            percentileCut: dept.jeongsi.percentileCut,
            group: grp,
            rawGroup: rawGrp,
            koreanWeight: dept.jeongsi.subjectWeights.korean || 25,
            mathWeight: dept.jeongsi.subjectWeights.math || 40,
            tamguWeight: dept.jeongsi.subjectWeights.inquiry || 25,
            isUserTarget: false,
          });
        }
      });
      return {
        univId: univ.univId,
        univName: univ.univName,
        departments: list,
      };
    });
  }, []);

  // Combined flat options list
  const allTargetOptions = useMemo(() => {
    const dbFlat = dbTargetsByUniv.flatMap((u) => u.departments);
    return [...userTargets, ...dbFlat];
  }, [userTargets, dbTargetsByUniv]);

  // Active selected target ID
  const [selectedTargetId, setSelectedTargetId] = useState<string>(() => {
    return userTargets[0]?.id || allTargetOptions[0]?.id || '';
  });

  // Only initialize / fallback if selection is completely empty or target was deleted
  useEffect(() => {
    if (!selectedTargetId && allTargetOptions.length > 0) {
      const initial = userTargets[0] || allTargetOptions[0];
      setSelectedTargetId(initial.id);
      if (onSelectTarget) onSelectTarget(initial);
    }
  }, [selectedTargetId, allTargetOptions, userTargets, onSelectTarget]);

  const selectedTarget = useMemo(() => {
    return (
      allTargetOptions.find((t) => t.id === selectedTargetId) ||
      userTargets[0] ||
      allTargetOptions[0] || {
        id: 'default',
        univName: '목표 대학 미등록',
        deptName: '학과 선택 필요',
        percentileCut: 85.0,
        group: '가군' as const,
        rawGroup: 'ga' as const,
        koreanWeight: 25,
        mathWeight: 40,
        tamguWeight: 25,
        isUserTarget: false,
      }
    );
  }, [allTargetOptions, selectedTargetId, userTargets]);

  // Latest mock exam
  const latestExam = useMemo(() => {
    const exams = mockExams.length > 0 ? mockExams : activeChild?.mockExams || [];
    if (exams.length === 0) return null;
    return [...exams].sort(
      (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
    )[0];
  }, [mockExams, activeChild?.mockExams]);

  // Calculate student's weighted percentile based on the selected university's formula
  const studentMetrics = useMemo(() => {
    if (!latestExam) return { weightedPercentile: 0, mathPct: 0, koreanPct: 0, tamguPct: 0, engGrade: 3 };

    const mathPct = latestExam.scores.math.percentile ?? 0;
    const koreanPct = latestExam.scores.korean.percentile ?? 0;
    const socPct = latestExam.scores.integratedSocial.percentile ?? 0;
    const sciPct = latestExam.scores.integratedScience.percentile ?? 0;
    const tamguPct = (socPct + sciPct) / 2;
    const engGrade = latestExam.scores.english.grade ?? 2;

    const totalWeight = selectedTarget.koreanWeight + selectedTarget.mathWeight + selectedTarget.tamguWeight || 100;
    const weighted = (
      koreanPct * selectedTarget.koreanWeight +
      mathPct * selectedTarget.mathWeight +
      tamguPct * selectedTarget.tamguWeight
    ) / totalWeight;

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
    const target = allTargetOptions.find((t) => t.id === newId);
    if (target && onSelectTarget) {
      onSelectTarget(target);
    }
  };

  // Add simulated DB department directly to user's registered target universities
  const handleAddSimulatedToTarget = () => {
    if (!selectedTarget) return;

    const newTarget: TargetUniversity = {
      id: `target_jeongsi_${Date.now()}`,
      type: 'jeongsi',
      admissionType: '수능위주',
      universityName: selectedTarget.univName,
      departmentName: selectedTarget.deptName,
      jeongsiGroup: selectedTarget.rawGroup,
      jeongsiRequirements: {
        percentileCutoff: selectedTarget.percentileCut,
        subjectWeights: {
          korean: selectedTarget.koreanWeight,
          math: selectedTarget.mathWeight,
          inquiry: selectedTarget.tamguWeight,
          english: 0,
          history: 0,
        },
      },
    };

    addTargetUniversity(activeChild.id, newTarget);
    setSelectedTargetId(newTarget.id);
    alert(`[${selectedTarget.group}] ${selectedTarget.univName} ${selectedTarget.deptName} 학과가 내 정시 목표 포트폴리오에 성공적으로 등록되었습니다! ⭐`);
  };

  return (
    <div className="bg-navy rounded-3xl p-5 sm:p-6 text-cream shadow-retro-lg border-2 border-navy flex flex-col justify-between relative overflow-hidden space-y-4">
      {/* Background Decorative Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-coral/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-coral border border-navy flex items-center justify-center text-navy shadow-sm shrink-0">
              <Target className="w-4 h-4 text-navy" />
            </div>
            <h3 className="font-black text-cream text-base sm:text-lg tracking-tight">
              정시 목표 대학 Gap 분석
            </h3>
          </div>
          <span className="text-[10.5px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 text-cream border border-white/20 font-bold shrink-0">
            2026/2027 실측 입결
          </span>
        </div>

        {/* What-If Simulation Badge if viewing DB target */}
        {!selectedTarget.isUserTarget && (
          <div className="bg-indigo-500/30 rounded-2xl p-2.5 border border-indigo-400/40 flex items-center justify-between gap-2 mb-3">
            <div className="min-w-0 flex items-center gap-1.5 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate font-bold">전체 DB 실시간 What-If 시뮬레이션 중</span>
            </div>
            <button
              onClick={handleAddSimulatedToTarget}
              className="px-2.5 py-1 bg-coral hover:bg-coral-hover text-navy font-black text-[11px] rounded-xl shadow-sm hover:scale-105 transition-all shrink-0 flex items-center gap-1"
              title="이 학과를 내 정시 목표 대학으로 등록"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>내 목표에 담기</span>
            </button>
          </div>
        )}

        {/* Target University Dropdown Selector */}
        <div className="relative mb-3.5">
          <select
            value={selectedTargetId}
            onChange={handleTargetChange}
            aria-label="정시 목표 대학 및 시뮬레이션 학과 선택"
            className="w-full appearance-none bg-white/10 border-2 border-white/25 rounded-2xl px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-bold text-cream focus:outline-none focus:ring-2 focus:ring-coral transition-all cursor-pointer"
          >
            {/* 1. User's Registered Targets */}
            {userTargets.length > 0 && (
              <optgroup label={`⭐ 내가 등록한 정시 목표 대학 (${userTargets.length}개)`} className="text-navy bg-peach/30 font-black">
                {userTargets.map((t) => (
                  <option key={t.id} value={t.id} className="text-navy bg-white font-bold">
                    [{t.group}] {t.univName} {t.deptName} (70% 컷: {t.percentileCut}%)
                  </option>
                ))}
              </optgroup>
            )}

            {/* 2. All 178 Departments grouped by university */}
            {dbTargetsByUniv.map((u) => (
              <optgroup
                key={u.univId}
                label={`📚 ${u.univName} (${u.departments.length}개 학과)`}
                className="text-navy bg-cream font-black"
              >
                {u.departments.map((dept) => (
                  <option key={dept.id} value={dept.id} className="text-navy bg-white font-medium">
                    [{dept.group}] {dept.univName} {dept.deptName} (70% 컷: {dept.percentileCut}%)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-cream/80 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Comparison Scores Box */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 mb-3">
          <div className="flex items-center justify-between text-center divide-x divide-white/15">
            <div className="flex-1 px-2">
              <p className="text-[11px] text-cream/80 font-bold mb-0.5">
                {selectedTarget.isUserTarget ? '⭐ 내 목표 70% Cut' : '🎯 대학 70% Cut'}
              </p>
              <p className="text-xl sm:text-2xl font-black text-amber-300">
                {selectedTarget.percentileCut}%
              </p>
              <p className="text-[10.5px] text-cream/80 font-semibold mt-0.5 truncate">
                [{selectedTarget.group}] {selectedTarget.univName}
              </p>
            </div>

            <div className="flex-1 px-2">
              <p className="text-[11px] text-cream/80 font-bold mb-0.5">내 모의고사 환산</p>
              <p className="text-xl sm:text-2xl font-black text-sky">
                {latestExam ? `${studentMetrics.weightedPercentile}%` : '-'}
              </p>
              <p className="text-[10.5px] text-cream/80 font-semibold mt-0.5 truncate">
                {latestExam ? latestExam.examName.replace(/20\d\d년\s*/, '') : '성적 미등록'}
              </p>
            </div>
          </div>

          {/* Gap Status Pill */}
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-cream/90 font-bold">목표 격차(Gap):</span>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                isSafe
                  ? 'bg-emerald-400 text-navy border border-emerald-300'
                  : 'bg-coral text-navy border border-coral-hover'
              }`}
            >
              {isSafe ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy" />
                  <span>+{Math.abs(gap)}%p 안정권 도달 ✅</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-navy" />
                  <span>{Math.abs(gap)}%p 점수 부족 ⚠️</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Strategy Coaching Box */}
      <div className="bg-coral/20 rounded-2xl p-3.5 border-2 border-coral/40">
        <div className="flex items-center gap-1.5 mb-1.5 text-coral text-xs font-black">
          <Zap className="w-4 h-4 text-coral" />
          <span>점수 도약을 위한 우선순위 처방전</span>
        </div>
        <p className="text-xs text-cream font-medium leading-relaxed break-keep">
          {isSafe ? (
            <>
              현재 모의고사 성적이 <strong className="text-white underline decoration-sky decoration-2 font-black">{selectedTarget.deptName}</strong> 안정권입니다! 수능 당일까지 고난도 킬러 문제 풀이 감각을 유지하세요.
            </>
          ) : (
            <>
              가장 반영비가 높은 <strong className="text-amber-300 font-black">수학({selectedTarget.mathWeight}%)</strong>에서 4점짜리 1~2문제를 더 맞히면 백분위가 약 <strong className="text-white font-black">+3~5%p 상승</strong>하여 목표 컷에 즉시 도달할 수 있습니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
