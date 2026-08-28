'use client';

import React, { useState } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { TargetUniversity, SusiCategory, JeongsiGroup } from '@/types/admissions';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function TargetsTab() {
  const { activeChild, calculateCumulativeGPA } = useAdmissions();

  const currentGPA = calculateCumulativeGPA(activeChild.courses || []);
  const mockExams = activeChild.mockExams || [];
  const latestMock = mockExams.length > 0
    ? [...mockExams].sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())[0]
    : null;

  const targetUnivs = activeChild.targetUniversities || [];

  // Group susi cards
  const reachTargets = targetUnivs.filter((t) => t.type === 'susi' && t.susiCategory === 'reach');
  const targetTargets = targetUnivs.filter((t) => t.type === 'susi' && t.susiCategory === 'target');
  const safeTargets = targetUnivs.filter((t) => t.type === 'susi' && t.susiCategory === 'safe');

  // Jeongsi cards
  const gaTargets = targetUnivs.filter((t) => t.type === 'jeongsi' && t.jeongsiGroup === 'ga');
  const naTargets = targetUnivs.filter((t) => t.type === 'jeongsi' && t.jeongsiGroup === 'na');
  const daTargets = targetUnivs.filter((t) => t.type === 'jeongsi' && t.jeongsiGroup === 'da');

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight">
                [모듈 4] 목표 대학 포트폴리오 (수시 6장 + 정시 3군)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-coral/20 text-coral">
                Phase 4 ⭐
              </span>
            </div>
            <p className="text-xs sm:text-sm text-midnight/70 mt-0.5">
              {activeChild.name}의 내신 및 수능최저 충족 여부를 실시간 진단하고 포트폴리오를 관리합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Susi 6-Card Section (소신 2 / 적정 2 / 안정 2) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-peach/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              수시 6장 지원 카드 포트폴리오
            </h3>
          </div>
          <span className="text-xs font-bold text-navy-muted bg-cream px-3 py-1 rounded-full border border-peach/50">
            총 {targetUnivs.filter((t) => t.type === 'susi').length} / 6장 등록됨
          </span>
        </div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 소신 2장 (Reach) */}
          <div className="bg-red-50/50 rounded-2xl p-4 border-2 border-red-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-red-700 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-300">
                소신 / 상향 (2장)
              </span>
              <span className="text-[11px] text-red-600 font-bold">
                {reachTargets.length} / 2장
              </span>
            </div>

            <div className="space-y-2.5">
              {reachTargets.map((univ) => (
                <div key={univ.id} className="bg-white p-3.5 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-midnight text-sm">{univ.universityName}</p>
                      <p className="text-xs text-midnight/70 font-medium">{univ.departmentName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      {univ.admissionType}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-peach/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>합격 예상 컷:</span>
                      <strong className="text-midnight">{univ.susiRequirements?.expectedCutoffGrade}등급</strong>
                    </div>
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>수능최저:</span>
                      <span className="text-[10px] text-midnight/80 font-medium truncate max-w-[120px]">
                        {univ.susiRequirements?.minimumCsatRequirement?.description || '미적용'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {reachTargets.length < 2 && (
                <div className="border-2 border-dashed border-red-200 rounded-xl p-4 text-center text-red-400 text-xs font-medium">
                  + 소신 카드 슬롯 비어있음
                </div>
              )}
            </div>
          </div>

          {/* 적정 2장 (Target) */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-amber-800 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                적정 지원 (2장)
              </span>
              <span className="text-[11px] text-amber-700 font-bold">
                {targetTargets.length} / 2장
              </span>
            </div>

            <div className="space-y-2.5">
              {targetTargets.map((univ) => (
                <div key={univ.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-midnight text-sm">{univ.universityName}</p>
                      <p className="text-xs text-midnight/70 font-medium">{univ.departmentName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {univ.admissionType}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-peach/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>합격 예상 컷:</span>
                      <strong className="text-midnight">{univ.susiRequirements?.expectedCutoffGrade}등급</strong>
                    </div>
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>수능최저:</span>
                      <span className="text-[10px] text-midnight/80 font-medium truncate max-w-[120px]">
                        {univ.susiRequirements?.minimumCsatRequirement?.description || '미적용'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {targetTargets.length < 2 && (
                <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 text-center text-amber-500 text-xs font-medium">
                  + 적정 카드 슬롯 비어있음
                </div>
              )}
            </div>
          </div>

          {/* 안정 2장 (Safe) */}
          <div className="bg-emerald-50/50 rounded-2xl p-4 border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                안정 / 합격권 (2장)
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">
                {safeTargets.length} / 2장
              </span>
            </div>

            <div className="space-y-2.5">
              {safeTargets.map((univ) => (
                <div key={univ.id} className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-midnight text-sm">{univ.universityName}</p>
                      <p className="text-xs text-midnight/70 font-medium">{univ.departmentName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {univ.admissionType}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-peach/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>합격 예상 컷:</span>
                      <strong className="text-midnight">{univ.susiRequirements?.expectedCutoffGrade}등급</strong>
                    </div>
                    <div className="flex items-center justify-between text-midnight/70">
                      <span>수능최저:</span>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 inline" />
                        <span>충족 가능</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {safeTargets.length < 2 && (
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center text-emerald-600 text-xs font-medium">
                  + 안정 카드 슬롯 비어있음
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Jeongsi 3-Gun Section (가군 / 나군 / 다군) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-peach/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
              <GraduationCap className="w-4 h-4 text-midnight" />
            </div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              정시 가 / 나 / 다군 포트폴리오
            </h3>
          </div>
          <span className="text-xs text-midnight/60 font-medium">
            최근 모평 기준 백분위 비교
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 가군 */}
          <div className="bg-cream/60 p-4 rounded-2xl border border-peach/50">
            <span className="font-black text-navy text-xs px-2 py-0.5 rounded-lg bg-coral/20 text-coral inline-block mb-2">
              [가군]
            </span>
            <p className="font-black text-midnight text-sm">인하대학교</p>
            <p className="text-midnight/70 font-medium">컴퓨터공학과 (수능일반)</p>
            <div className="mt-3 pt-2 border-t border-peach/30 flex items-center justify-between">
              <span className="text-midnight/60">70% 컷:</span>
              <strong className="text-midnight">백분위 84.5%</strong>
            </div>
          </div>

          {/* 나군 */}
          <div className="bg-cream/60 p-4 rounded-2xl border border-peach/50">
            <span className="font-black text-navy text-xs px-2 py-0.5 rounded-lg bg-pastel-sky/50 text-midnight inline-block mb-2">
              [나군]
            </span>
            <p className="font-black text-midnight text-sm">국립인천대학교</p>
            <p className="text-midnight/70 font-medium">수학교육과 (수능일반)</p>
            <div className="mt-3 pt-2 border-t border-peach/30 flex items-center justify-between">
              <span className="text-midnight/60">70% 컷:</span>
              <strong className="text-midnight">백분위 80.3%</strong>
            </div>
          </div>

          {/* 다군 */}
          <div className="bg-cream/60 p-4 rounded-2xl border border-peach/50">
            <span className="font-black text-navy text-xs px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 inline-block mb-2">
              [다군]
            </span>
            <p className="font-black text-midnight text-sm">중앙대학교</p>
            <p className="text-midnight/70 font-medium">소프트웨어학부 (수능일반)</p>
            <div className="mt-3 pt-2 border-t border-peach/30 flex items-center justify-between">
              <span className="text-midnight/60">70% 컷:</span>
              <strong className="text-midnight">백분위 91.5%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
