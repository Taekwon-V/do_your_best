'use client';

import React, { useState, useRef } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import OnePageConsultingReport from '@/components/report/OnePageConsultingReport';
import {
  FileText,
  Printer,
  BookOpen,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Building,
  Cloud,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UNIVERSITY_ADMISSIONS_DB } from '@/data/universityAdmissionsDB';

export default function ReportsTab() {
  const {
    activeChild,
    calculateCumulativeGPA,
    exportDataAsJSON,
    importDataFromJSON,
    resetToInitialData,
  } = useAdmissions();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedUnivFilter, setSelectedUnivFilter] = useState<'all' | 'inha' | 'incheon' | 'cau'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentGPA = calculateCumulativeGPA(activeChild.courses || []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataFromJSON(content);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('모든 데이터를 최초 기본값(초기 세팅)으로 초기화하시겠습니까? (기존 입력 내용은 초기화됩니다)')) {
      resetToInitialData();
      alert('기본 데이터로 초기화되었습니다.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-sm shrink-0">
            <FileText className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-2xl font-black text-midnight tracking-tight leading-tight">
                입결 DB & 상담용 1장 리포트
              </h2>
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                A4 출력
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-midnight/70 mt-0.5">
              상담용 A4 1장 출력, 대학별 5등급제 입결 조회 및 가족 클라우드 백업을 관리합니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-2xl bg-navy text-cream font-bold text-xs sm:text-sm shadow-retro hover:bg-navy-light active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-coral" />
          <span>상담용 1장 리포트 인쇄 / PDF 출력</span>
        </button>
      </div>

      {/* 2. Cloud Sync & Backup / Restore Management Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-peach/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
              <Cloud className="w-4 h-4 text-midnight" />
            </div>
            <div>
              <h3 className="font-bold text-midnight text-base sm:text-lg flex items-center gap-2">
                <span>가족 클라우드 동기화 & 데이터 백업/복원</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>실시간 연동 중</span>
                </span>
              </h3>
              <p className="text-xs text-midnight/60">
                어떤 기기(PC, 스마트폰, 태블릿)에서든 동일하게 자동 저장되며, 언제든 파일로 백업할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JSON Export */}
          <button
            onClick={exportDataAsJSON}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-cream/70 hover:bg-peach/30 border border-peach/60 text-midnight font-bold text-xs sm:text-sm transition-all"
          >
            <Download className="w-4 h-4 text-navy" />
            <span>JSON 백업 파일 다운로드</span>
          </button>

          {/* JSON Import */}
          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-cream/70 hover:bg-peach/30 border border-peach/60 text-midnight font-bold text-xs sm:text-sm transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-coral" />
            <span>JSON 백업 파일 복원</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-50/60 hover:bg-red-100/60 border border-red-200 text-red-700 font-bold text-xs sm:text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>기본 프리셋으로 초기화</span>
          </button>
        </div>
      </div>

      {/* 3. 124-Unit Master Grade Conversion Matrix Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-peach/30 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-coral/20 flex items-center justify-center text-coral shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-black text-navy text-sm sm:text-lg break-keep">
              일반고 124단위 가중치 마스터 환산 조견표 (핵심 요약)
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-navy px-2.5 py-0.5 bg-cream rounded-full border border-peach/40 self-start sm:self-auto shrink-0">
            현재 {activeChild.name} 내신: {currentGPA.toFixed(2)}등급
          </span>
        </div>

        <div className="text-[10.5px] text-navy-muted sm:hidden pb-1 flex items-center justify-end">
          <span>← 표를 좌우로 밀어서 전체 열 확인 →</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-peach/50 scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[560px] sm:min-w-[650px]">
            <thead>
              <tr className="bg-cream/80 text-midnight font-bold border-b border-peach/40">
                <th className="py-2.5 px-3">2028 5등급제</th>
                <th className="py-2.5 px-2.5 text-center">전국 누적 백분위</th>
                <th className="py-2.5 px-2.5 text-center">9등급제 환산</th>
                <th className="py-2.5 px-3">교과(지균) 지원선</th>
                <th className="py-2.5 px-3">학종(면접형) 지원선</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-peach/30 text-midnight/80">
              {[
                { g5: '1.0등급', topPct: '상위 0.89%', g9: '1.31등급', gyogwa: '서울대(지균), 메이저 의치약, 연세대', jonghap: '서울대(일반), 연고대 최상위 학종' },
                { g5: '1.2등급', topPct: '상위 3.05%', g9: '1.85등급', gyogwa: '서강대, 성균관대, 한양대, 중앙대', jonghap: '연세대, 고려대, 서성한 인기과' },
                { g5: '1.4등급', topPct: '상위 5.67%', g9: '2.27등급', gyogwa: '한국외대, 건동홍, 인하/인천 사범대', jonghap: '중앙대, 경희대, 인하/인천 사범대 안정' },
                { g5: '1.6등급', topPct: '상위 8.90%', g9: '2.65등급', gyogwa: '국숭세단 교과, 인천대 일반 교과', jonghap: '건동홍 학종, 인하대/인천대 사범대(수학/국어) 적정' },
                { g5: '1.8등급', topPct: '상위 12.87%', g9: '3.01등급', gyogwa: '인하대/인천대 일반학과, 광명상가', jonghap: '국숭세단 학종, 인하/인천 수학과·국문과(교직) 적정' },
                { g5: '2.0등급', topPct: '상위 17.75%', g9: '3.37등급', gyogwa: '인천대(교과우수 최저충족 시)', jonghap: '인하대·인천대 일반 자연/인문 학종 적정' },
                { g5: '2.2등급', topPct: '상위 23.22%', g9: '3.71등급', gyogwa: '가천대, 경기대, 거점국립대', jonghap: '인천대 일반학과 학종, 수도권 대학 학종' },
                { g5: '2.5등급', topPct: '상위 33.30%', g9: '4.24등급', gyogwa: '수도권 외곽 대학, 지방 국립대', jonghap: '인천대 일반학과 학종(면접 역전 마지노선)' },
              ].map((row, idx) => {
                const isCurrentRange = currentGPA >= parseFloat(row.g5) - 0.1 && currentGPA < parseFloat(row.g5) + 0.15;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCurrentRange ? 'bg-coral/15 font-black text-navy' : 'hover:bg-cream/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-midnight flex items-center gap-1.5">
                      {isCurrentRange && <span className="w-2 h-2 rounded-full bg-coral shrink-0" />}
                      <span>{row.g5}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-coral">{row.topPct}</td>
                    <td className="py-2.5 px-3 text-center font-medium">{row.g9}</td>
                    <td className="py-2.5 px-3 text-xs">{row.gyogwa}</td>
                    <td className="py-2.5 px-3 text-xs">{row.jonghap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. University Admission DB Card (Inha / Incheon / CAU) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-peach/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-pastel-sky/30 flex items-center justify-center text-midnight">
              <Building className="w-4 h-4 text-midnight" />
            </div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              대학별 5등급제 수시/정시 입결 데이터베이스
            </h3>
          </div>

          {/* Univ Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { key: 'all', label: '전체' },
              { key: 'inha', label: '인하대학교' },
              { key: 'incheon', label: '국립인천대학교' },
              { key: 'cau', label: '중앙대학교' },
              { key: 'suwon', label: '수원대학교' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedUnivFilter(f.key as any)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  selectedUnivFilter === f.key
                    ? 'bg-navy text-cream shadow-sm'
                    : 'bg-cream text-navy/70 hover:bg-peach/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* University Full DB Table View */}
        <div className="space-y-4">
          {UNIVERSITY_ADMISSIONS_DB.filter(
            (u) => selectedUnivFilter === 'all' || selectedUnivFilter === u.univId
          ).map((univ) => (
            <div key={univ.univId} className="bg-cream/40 p-4 rounded-2xl border border-peach/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-navy text-sm sm:text-base">{univ.univName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-peach/70 text-navy border border-navy/20">
                    {univ.badge}
                  </span>
                </div>
                <span className="text-[11px] text-navy/60 font-bold">
                  총 {univ.departments.length}개 모집단위
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-peach/50 scrollbar-thin">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead>
                    <tr className="bg-white text-midnight font-bold border-b border-peach/40">
                      <th className="py-2 px-3">단과대</th>
                      <th className="py-2 px-3">모집단위 (학과)</th>
                      <th className="py-2 px-3 text-center">수시 교과 (5등급제 컷)</th>
                      <th className="py-2 px-3 text-center">수시 학종 (5등급제 컷)</th>
                      <th className="py-2 px-3 text-center">정시 70% 백분위</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-peach/30 text-midnight/80 bg-white/60">
                    {univ.departments.map((dept, dIdx) => (
                      <tr key={dIdx} className="hover:bg-cream/50 transition-colors">
                        <td className="py-2 px-3 text-navy/70 text-[11px]">{dept.collegeName}</td>
                        <td className="py-2 px-3 font-bold text-navy">{dept.deptName}</td>
                        <td className="py-2 px-3 text-center">
                          {dept.susiGyogwa ? (
                            <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                              {dept.susiGyogwa.expectedCut5}등급
                            </span>
                          ) : (
                            <span className="text-navy/40 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {dept.susiJonghap ? (
                            <span className="font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                              {dept.susiJonghap.expectedCut5}등급
                            </span>
                          ) : (
                            <span className="text-navy/40 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {dept.jeongsi ? (
                            <span className="font-black text-coral bg-coral/15 px-2 py-0.5 rounded text-[11px]">
                              {dept.jeongsi.group === 'ga' ? '가군' : dept.jeongsi.group === 'na' ? '나군' : '다군'} {dept.jeongsi.percentileCut}%
                            </span>
                          ) : (
                            <span className="text-navy/40 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* One-Page Report Modal */}
      <OnePageConsultingReport
        child={activeChild}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
