'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { TargetUniversity, SusiCategory } from '@/types/admissions';
import { TrendingUp, Award, CheckCircle2, AlertCircle, ArrowUpRight, BarChart3 } from 'lucide-react';

const CATEGORY_BADGES: Record<SusiCategory, { label: string; bg: string; text: string }> = {
  safe: { label: '안정권 🟢', bg: 'bg-sky-light', text: 'text-navy' },
  target: { label: '적정권 🟡', bg: 'bg-peach-light', text: 'text-navy' },
  reach: { label: '소신/상향 🟠', bg: 'bg-coral-light', text: 'text-navy' },
};

export default function OverviewGrid() {
  const { activeChild, calculateCumulativeGPA } = useAdmissions();
  const currentGPA = calculateCumulativeGPA(activeChild.courses || []);
  const susiTargets = (activeChild.targetUniversities || []).filter((t) => t.type === 'susi');
  const mockExams = activeChild.mockExams || [];
  const latestMock = mockExams.length > 0 ? mockExams[0] : null;

  return (
    <div className="space-y-8">
      
      {/* 1. 수시 6장 지원 포트폴리오 섹션 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-navy tracking-tight">
              수시 6장 지원 포트폴리오
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 bg-coral text-navy rounded-full border border-navy shadow-sm">
              {susiTargets.length} / 6 카드 설정됨
            </span>
          </div>
          <span className="text-xs text-navy-muted font-medium hidden sm:inline">
            안정 2장 / 적정 2장 / 소신 2장 추천 배분
          </span>
        </div>

        {/* 6개 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {susiTargets.map((target, idx) => {
            const badge = target.susiCategory ? CATEGORY_BADGES[target.susiCategory] : null;
            return (
              <div
                key={target.id || idx}
                className="bg-white rounded-2xl border-2 border-navy p-5 shadow-retro hover:shadow-retro-lg transition-all duration-150 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-navy-muted px-2 py-0.5 bg-cream rounded-md border border-navy/30">
                      수시 카드 #{idx + 1}
                    </span>
                    {badge && (
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border border-navy ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-navy group-hover:text-navy-muted transition-colors">
                      {target.universityName}
                    </h3>
                    <p className="text-sm font-bold text-navy-muted">
                      {target.departmentName}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-navy/15 space-y-2 text-xs text-navy">
                  <div className="flex justify-between items-center">
                    <span className="text-navy-muted">예상 합격 컷:</span>
                    <strong className="font-black text-sm text-navy">
                      {target.susiRequirements?.expectedCutoffGrade} 등급
                    </strong>
                  </div>
                  {target.susiRequirements?.minimumCsatRequirement && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-navy-muted">수능최저:</span>
                      <span className="font-bold text-navy truncate max-w-[170px]" title={target.susiRequirements.minimumCsatRequirement.description}>
                        {target.susiRequirements.minimumCsatRequirement.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 빈 슬롯 카드 (6장 중 남은 슬롯) */}
          {Array.from({ length: Math.max(0, 6 - susiTargets.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="bg-white/40 border-2 border-dashed border-navy/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center text-navy-muted min-h-[160px] space-y-2 hover:bg-white/60 transition-colors"
            >
              <span className="text-xs font-bold px-2 py-0.5 bg-cream/70 rounded border border-navy/20">
                수시 카드 #{susiTargets.length + idx + 1}
              </span>
              <p className="text-xs font-medium text-navy-muted">
                목표 대학 탭에서 수시 카드 추가 가능
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 하단 5등급제 GPA 지표 & 모의고사 성장 곡선 쉘 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 좌측: 5등급제 내신 시뮬레이터 프리뷰 쉘 */}
        <div className="bg-white rounded-3xl border-2 border-navy p-6 shadow-retro space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky border border-navy flex items-center justify-center text-navy">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-navy">
                2028 내신 5등급제 성적 요약
              </h3>
            </div>
            <span className="text-xs font-bold text-navy-muted">
              {(activeChild.courses || []).length}개 이수 과목
            </span>
          </div>

          {/* 5등급제 누적 등급 게이지 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-navy">
              <span>현재 누적 내신</span>
              <span className="text-base font-black text-navy">{currentGPA} 등급 (1등급 10% 기준)</span>
            </div>
            
            {/* 5등급 바 시각화 (Happy Hues 17 palette) */}
            <div className="grid grid-cols-5 gap-1.5 h-3">
              <div className={`rounded-l-full border border-navy ${currentGPA <= 1.0 ? 'bg-navy' : 'bg-navy/70'}`} title="1등급 (상위 10%)"></div>
              <div className={`border border-navy ${currentGPA <= 2.0 ? 'bg-sky' : 'bg-sky/40'}`} title="2등급 (상위 34%)"></div>
              <div className={`border border-navy ${currentGPA <= 3.0 ? 'bg-peach' : 'bg-peach/40'}`} title="3등급 (상위 66%)"></div>
              <div className={`border border-navy ${currentGPA <= 4.0 ? 'bg-coral' : 'bg-coral/40'}`} title="4등급 (상위 90%)"></div>
              <div className={`rounded-r-full border border-navy ${currentGPA <= 5.0 ? 'bg-cream-subtle' : 'bg-cream'}`} title="5등급 (상위 100%)"></div>
            </div>

            <div className="flex justify-between text-[10px] text-navy-muted font-extrabold pt-1">
              <span>1등급(10%)</span>
              <span>2등급(34%)</span>
              <span>3등급(66%)</span>
              <span>4등급(90%)</span>
              <span>5등급(100%)</span>
            </div>
          </div>

          <div className="p-3.5 bg-cream rounded-2xl border border-navy/20 flex items-start gap-2.5 text-xs text-navy leading-relaxed">
            <TrendingUp className="w-4 h-4 text-coral shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">내신 역산 시뮬레이터:</span> 수시 내신 탭에서 <strong>목표 등급 역산 슬라이더</strong>와 <strong>학기별 내신 성적 관리</strong>를 이용하실 수 있습니다.
            </div>
          </div>
        </div>

        {/* 우측: 통합수능 모의고사 트래커 프리뷰 쉘 */}
        <div className="bg-white rounded-3xl border-2 border-navy p-6 shadow-retro space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-coral border border-navy flex items-center justify-center text-navy">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-navy">
                2028 통합수능 모의고사 현황
              </h3>
            </div>
            <span className="text-xs font-bold text-navy-muted">
              최근: {latestMock?.examName || '미입력'}
            </span>
          </div>

          {/* 최근 모의고사 백분위 미니 카드 */}
          {latestMock && latestMock.scores ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-cream rounded-xl border border-navy/20">
                <span className="text-[10px] font-bold text-navy-muted block">국어 (공통)</span>
                <span className="text-sm font-black text-navy">
                  {latestMock.scores.korean?.percentile !== undefined ? `${latestMock.scores.korean.percentile}%` : '-'}
                  {latestMock.scores.korean?.grade ? ` (${latestMock.scores.korean.grade}등급)` : ''}
                </span>
              </div>
              <div className="p-2.5 bg-cream rounded-xl border border-navy/20">
                <span className="text-[10px] font-bold text-navy-muted block">수학 (공통)</span>
                <span className="text-sm font-black text-coral">
                  {latestMock.scores.math?.percentile !== undefined ? `${latestMock.scores.math.percentile}%` : '-'}
                  {latestMock.scores.math?.grade ? ` (${latestMock.scores.math.grade}등급)` : ''}
                </span>
              </div>
              <div className="p-2.5 bg-cream rounded-xl border border-navy/20">
                <span className="text-[10px] font-bold text-navy-muted block">통합사회·과학</span>
                <span className="text-sm font-black text-navy">
                  {(((latestMock.scores.integratedScience?.percentile ?? 0) + (latestMock.scores.integratedSocial?.percentile ?? 0)) / 2).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-navy-muted py-4 text-center">등록된 모의고사 데이터가 없습니다.</p>
          )}

          <div className="p-3.5 bg-sky/30 rounded-2xl border border-navy/20 flex items-start gap-2.5 text-xs text-navy leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">정시 모의고사 탭:</span> 시계열 백분위 성장 궤적 차트와 대학별 가중치를 반영한 <strong>정시 맞춤 환산선 & Gap 분석</strong>을 확인하세요.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
