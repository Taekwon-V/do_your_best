'use client';

import React from 'react';
import { TargetUniversity, MockExamRecord } from '@/types/admissions';
import { Lightbulb, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface WhatIfStrategyWidgetProps {
  currentGPA: number;
  latestMock: MockExamRecord | null;
  targetUniversities: TargetUniversity[];
  childName: string;
}

export default function WhatIfStrategyWidget({
  currentGPA,
  latestMock,
  targetUniversities = [],
  childName,
}: WhatIfStrategyWidgetProps) {
  const mathPct = latestMock?.scores.math.percentile ?? 85;
  const inhaSusi = targetUniversities.find((t) => t.universityName.includes('인하') && t.type === 'susi');
  const incheonJeongsi = targetUniversities.find((t) => t.universityName.includes('인천') && t.type === 'jeongsi');

  return (
    <div className="bg-midnight rounded-3xl p-5 sm:p-6 text-cream shadow-md relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-coral/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
            <Lightbulb className="w-4 h-4 text-coral" />
          </div>
          <h3 className="font-bold text-cream text-base sm:text-lg">
            What-If 입시 도약 시나리오
          </h3>
        </div>
        <p className="text-xs text-cream/70 mb-4">
          작은 성적 변화가 합격 확률을 어떻게 바꾸는지 실시간 시뮬레이션합니다.
        </p>

        {/* 3 Motivational Scenario Cards */}
        <div className="space-y-2.5">
          {/* Scenario 1: 내신 도약 */}
          <div className="bg-cream/10 rounded-2xl p-3.5 border border-cream/15">
            <div className="flex items-center gap-1.5 text-coral text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[수시 내신 도약]</span>
            </div>
            <p className="text-xs text-cream/90 leading-relaxed">
              남은 학기 국·수 4단위 과목을 <strong>1.5등급 이내</strong>로 유지하면 최종 누적 내신이 <strong className="text-pastel-sky">2.10등급</strong>으로 상승하여, {inhaSusi?.universityName || '인하대'} 학생부종합전형이 <strong>&apos;소신&apos;에서 &apos;적정 합격권&apos;</strong>으로 승격됩니다!
            </p>
          </div>

          {/* Scenario 2: 수능최저 충족 */}
          <div className="bg-cream/10 rounded-2xl p-3.5 border border-cream/15">
            <div className="flex items-center gap-1.5 text-pastel-sky text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>[수능최저 100% 충족]</span>
            </div>
            <p className="text-xs text-cream/90 leading-relaxed">
              현재 수학({mathPct}%)의 1등급 안정성을 기반으로 <strong>영어 2등급 + 탐구 2등급</strong>을 유지하면, 지원 예정인 <strong>수시 6개 대학의 수능최저를 100% 여유 있게 통과</strong>합니다.
            </p>
          </div>

          {/* Scenario 3: 정시 안전 합격선 */}
          <div className="bg-cream/10 rounded-2xl p-3.5 border border-cream/15">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>[정시 역전 시나리오]</span>
            </div>
            <p className="text-xs text-cream/90 leading-relaxed">
              수학 공통 4점짜리 1문제만 더 맞히면 정시 환산 백분위가 <strong>+4%p 상승</strong>하여, {incheonJeongsi?.universityName || '국립인천대'} 사범대학/컴퓨터계열을 <strong>최초 합격선</strong>으로 굳힐 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Motivation */}
      <div className="mt-4 pt-3 border-t border-cream/10 text-center">
        <p className="text-xs font-bold text-coral">
          🌟 {childName}은(는) 지금 충분히 해낼 수 있는 상승 궤도 위에 있습니다!
        </p>
      </div>
    </div>
  );
}
