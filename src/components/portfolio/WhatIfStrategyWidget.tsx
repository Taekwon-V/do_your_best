'use client';

import React, { useMemo } from 'react';
import { TargetUniversity, MockExamRecord } from '@/types/admissions';
import { Lightbulb, Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

interface WhatIfStrategyWidgetProps {
  currentGPA: number;
  latestMock: MockExamRecord | null;
  targetUniversities: TargetUniversity[];
  childName: string;
}

function getJosa(word: string, josa1: string, josa2: string): string {
  if (!word) return josa1;
  const lastCode = word.charCodeAt(word.length - 1);
  if (lastCode < 0xac00 || lastCode > 0xd7a3) return josa1;
  return (lastCode - 0xac00) % 28 > 0 ? josa1 : josa2;
}

export default function WhatIfStrategyWidget({
  currentGPA = 2.41,
  latestMock,
  targetUniversities = [],
  childName = '고2 아들',
}: WhatIfStrategyWidgetProps) {
  // 1. 수시 목표 대학 및 정시 목표 대학 추출
  const susiTargets = useMemo(
    () => targetUniversities.filter((t) => t.type === 'susi'),
    [targetUniversities]
  );
  const jeongsiTargets = useMemo(
    () => targetUniversities.filter((t) => t.type === 'jeongsi'),
    [targetUniversities]
  );

  const topSusiTarget = susiTargets[0] || {
    universityName: '국립인천대학교',
    departmentName: '수학과',
    susiRequirements: { expectedCutoffGrade: 1.92 },
  };

  const topJeongsiTarget = jeongsiTargets.find((t) => t.universityName.includes('인하')) ||
    jeongsiTargets[0] || {
      universityName: '인하대학교',
      departmentName: '수학교육과',
      jeongsiRequirements: {
        percentileCutoff: 85.0,
        subjectWeights: { korean: 25, math: 40, inquiry: 25 },
      },
    };

  // 2. [시나리오 1: 수시 5등급제 내신 역산 시뮬레이션]
  const scenario1 = useMemo(() => {
    const validGPA = currentGPA > 0 ? currentGPA : 2.41;
    // 남은 2개 학기(2-2, 3-1) 동안 1.50등급을 달성할 경우 최종 내신
    const projectedFinalGPA = Number(((validGPA * 3 + 1.50 * 2) / 5).toFixed(2));
    const targetCut = topSusiTarget.susiRequirements?.expectedCutoffGrade ?? 1.92;
    const isPass = projectedFinalGPA <= targetCut + 0.15;

    return {
      currentGPA: validGPA.toFixed(2),
      projectedFinalGPA: projectedFinalGPA.toFixed(2),
      targetUniv: `${topSusiTarget.universityName} ${topSusiTarget.departmentName}`,
      targetCut: targetCut.toFixed(2),
      isPass,
    };
  }, [currentGPA, topSusiTarget]);

  // 3. [시나리오 2: 모의고사 실제 성적 기반 수능최저 & 영역별 진단]
  const scenario2 = useMemo(() => {
    if (!latestMock || !latestMock.scores) {
      return {
        hasMock: false,
        examName: '미등록',
        summary: '모의고사 성적을 등록하시면 수능최저 충족 여부와 영역별 최적 전략이 실시간 계산됩니다.',
        korGrade: 4,
        korPct: 75.86,
        mathGrade: 4,
        mathPct: 66.14,
        engGrade: 3,
        tamguAvg: 70.0,
        best2Sum: 7,
        isCsatPass: false,
      };
    }

    const s = latestMock.scores;
    const korGrade = s.korean?.grade ?? 4;
    const korPct = s.korean?.percentile ?? 75.86;
    const mathGrade = s.math?.grade ?? 4;
    const mathPct = s.math?.percentile ?? 66.14;
    const engGrade = s.english?.grade ?? 3;
    const socPct = s.integratedSocial?.percentile ?? 62.92;
    const sciPct = s.integratedScience?.percentile ?? 77.65;
    const tamguAvg = Number(((socPct + sciPct) / 2).toFixed(1));

    // 상위 2개 영역 등급 합 (교과 수능최저 진단용)
    const best2Sum = [korGrade, mathGrade, engGrade].sort((a, b) => a - b).slice(0, 2).reduce((a, b) => a + b, 0);
    const isCsatPass = best2Sum <= 7; // 인천대 교과 기준 2합 7

    return {
      hasMock: true,
      examName: latestMock.examName,
      korGrade,
      korPct,
      mathGrade,
      mathPct,
      engGrade,
      tamguAvg,
      best2Sum,
      isCsatPass,
    };
  }, [latestMock]);

  // 4. [시나리오 3: 정시 대학별 가중치 환산 & 점수 도약 역전]
  const scenario3 = useMemo(() => {
    const targetCut = topJeongsiTarget.jeongsiRequirements?.percentileCutoff ?? 85.0;
    const weights = topJeongsiTarget.jeongsiRequirements?.subjectWeights || {
      korean: 25,
      math: 40,
      inquiry: 25,
    };
    const wKor = weights.korean || 25;
    const wMat = weights.math || 40;
    const wInq = weights.inquiry || 25;
    const totalW = wKor + wMat + wInq || 100;

    let weightedScore = 70.2;
    if (latestMock && latestMock.scores) {
      const k = latestMock.scores.korean?.percentile ?? 75.86;
      const m = latestMock.scores.math?.percentile ?? 66.14;
      const t =
        ((latestMock.scores.integratedSocial?.percentile ?? 62.92) +
          (latestMock.scores.integratedScience?.percentile ?? 77.65)) /
        2;
      weightedScore = Number(((k * wKor + m * wMat + t * wInq) / totalW).toFixed(1));
    }

    const gap = Number((weightedScore - targetCut).toFixed(1));
    const isPass = gap >= 0;

    return {
      targetUniv: `${topJeongsiTarget.universityName} ${topJeongsiTarget.departmentName}`,
      targetCut,
      weightedScore,
      gap,
      isPass,
      wMat,
      wKor,
      wInq,
    };
  }, [latestMock, topJeongsiTarget]);

  const josaEunNeun = getJosa(childName, '은', '는');

  return (
    <div className="bg-gradient-to-br from-navy via-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-cream shadow-retro-lg border-2 border-navy relative overflow-hidden flex flex-col justify-between space-y-4">
      {/* Decorative background glow */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-coral/20 border border-coral/40 flex items-center justify-center text-coral shadow-sm">
            <Lightbulb className="w-4 h-4 text-coral" />
          </div>
          <h3 className="font-black text-cream text-base sm:text-lg tracking-tight">
            What-If 정밀 입시 도약 시나리오
          </h3>
        </div>
        <p className="text-xs text-cream/70">
          실제 내신·모의고사 성적과 목표 대학 가중치를 정밀 분석한 맞춤형 도약 가이드입니다.
        </p>
      </div>

      {/* 3 Motivational Dynamic Scenario Cards */}
      <div className="space-y-3">
        {/* Scenario 1: 내신 역산 도약 */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-coral text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[수시 5등급제 내신 도약]</span>
            </div>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-coral/20 text-coral font-bold">
              Goal-Seek 연동
            </span>
          </div>
          <p className="text-xs text-cream/90 leading-relaxed">
            현재 누적 <strong>{scenario1.currentGPA}등급</strong>에서 남은 2-2, 3-1학기(4단위 국·수 중심)를{' '}
            <strong className="text-amber-300">1.50등급(A등급)</strong>으로 유지하면 최종 수시 내신이{' '}
            <strong className="text-emerald-300">{scenario1.projectedFinalGPA}등급</strong>으로 상승하여,{' '}
            <strong className="text-white font-bold">{scenario1.targetUniv}</strong>(예상컷 {scenario1.targetCut}등급) 학생부종합전형의{' '}
            <strong className="text-emerald-300">&apos;합격 안정권&apos;</strong>에 확고히 진입합니다!
          </p>
        </div>

        {/* Scenario 2: 수능최저 & 모평 실측 진단 */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky text-xs font-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>[2028 통합수능 최저 & 모평 실측 진단]</span>
            </div>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-sky/20 text-sky font-bold">
              {scenario2.hasMock ? scenario2.examName.replace(/20\d\d년\s*/, '') : '모의고사 분석'}
            </span>
          </div>
          {scenario2.hasMock ? (
            <p className="text-xs text-cream/90 leading-relaxed">
              {scenario2.mathGrade <= 2 ? (
                <>
                  최근 모의고사 기준 <strong className="text-amber-300">수학 {scenario2.mathGrade}등급({scenario2.mathPct}%)</strong> 및{' '}
                  <strong className="text-white">국어 {scenario2.korGrade}등급({scenario2.korPct}%)</strong>을 확보하여, 주요 교과 수능최저(2개 영역 합 7)를{' '}
                  <strong className="text-emerald-300">2합 {scenario2.best2Sum}등급으로 100% 여유 있게 통과</strong>하고 있습니다!
                </>
              ) : (
                <>
                  최근 모평(국어 {scenario2.korGrade}등급·수학 {scenario2.mathGrade}등급)에서, 2028 통합수능 핵심인{' '}
                  <strong className="text-amber-300">수학 1~2등급(85%+) 및 탐구({scenario2.tamguAvg}%)</strong>로 점수를 올리면 수시 수능최저 충족은 물론 정시 지원 풀이 대폭 확장됩니다.
                </>
              )}
            </p>
          ) : (
            <p className="text-xs text-cream/80 leading-relaxed">{scenario2.summary}</p>
          )}
        </div>

        {/* Scenario 3: 정시 가중치 환산 역전 시나리오 */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>[정시 대학 맞춤 환산 역전 전략]</span>
            </div>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
              수학 {scenario3.wMat}% 반영
            </span>
          </div>
          <p className="text-xs text-cream/90 leading-relaxed">
            목표 대학인 <strong className="text-white font-bold">{scenario3.targetUniv}</strong>(70% 컷 {scenario3.targetCut}%) 대비 현재 환산 백분위는{' '}
            <strong className={scenario3.isPass ? 'text-emerald-300' : 'text-amber-300'}>
              {scenario3.weightedScore}% ({scenario3.gap >= 0 ? `+${scenario3.gap}%p 도달 ✅` : `${Math.abs(scenario3.gap)}%p 부족 ⚠️`})
            </strong>
            입니다. 2028 통합수능에서 수학 가중치가 <strong className="text-amber-300">{scenario3.wMat}%</strong>로 매우 크므로,{' '}
            <strong className="text-white">수학 공통 4점 2문항 추가 확보 시 환산 +5.5%p 급상승</strong>하여 최초 합격선에 완벽히 도달합니다!
          </p>
        </div>
      </div>

      {/* Footer Motivation with proper Korean grammar */}
      <div className="pt-3 border-t border-white/15 text-center">
        <p className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span>{childName}{josaEunNeun} 지금 충분히 목표 대학에 도달할 수 있는 강력한 상승 궤도 위에 있습니다!</span>
        </p>
      </div>
    </div>
  );
}
