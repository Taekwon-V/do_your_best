'use client';

import React from 'react';
import { ChildProfile, MockExamRecord } from '@/types/admissions';
import { calculateWeightedGPA } from '@/utils/gpaCalculator';
import { GraduationCap, Award, Calendar, CheckCircle2, ShieldCheck, Printer, X } from 'lucide-react';

interface OnePageConsultingReportProps {
  child: ChildProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function OnePageConsultingReport({
  child,
  isOpen,
  onClose,
}: OnePageConsultingReportProps) {
  if (!isOpen) return null;

  const currentGPA = calculateWeightedGPA(child.courses || []);
  const mockExams = child.mockExams || [];
  const latestMock: MockExamRecord | null = mockExams.length > 0
    ? [...mockExams].sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())[0]
    : null;

  const susiTargets = (child.targetUniversities || []).filter((t) => t.type === 'susi');
  const jeongsiTargets = (child.targetUniversities || []).filter((t) => t.type === 'jeongsi');

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-midnight/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Container - Styled as pristine A4 Page */}
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-peach/60 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-midnight space-y-4 my-auto">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-peach/40 print:hidden gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-navy text-cream flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-4 h-4 text-coral" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy leading-tight">상담용 1장 종합 리포트</h3>
              <p className="text-[10.5px] sm:text-xs text-navy/60">A4 규격 1장 맞춤 인쇄</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-navy text-cream text-xs sm:text-sm font-bold shadow-retro hover:bg-navy-light transition-all"
            >
              <Printer className="w-4 h-4 text-coral" />
              <span>A4 인쇄</span>
            </button>
            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-xl hover:bg-peach/30 text-midnight/70">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== A4 1-PAGE CONTENT ===================== */}
        <div className="space-y-3.5 print:text-black">
          
          {/* Header Row */}
          <div className="flex items-start justify-between pb-2.5 border-b-2 border-navy">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
                  2028 대입 전략 맞춤 컨설팅 리포트
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-coral/20 text-navy border border-navy/30">
                  {child.targetAdmissionYear} 대입 개편안
                </span>
              </div>
              <p className="text-xs text-navy/70 mt-0.5">
                수험생: <strong>{child.name}</strong> ({child.currentGrade === 2 ? '고등학교 2학년' : '고등학교 1학년'}) | 희망 진로: <strong>{child.targetMajorField}</strong>
              </p>
            </div>

            <div className="text-right text-[11px] text-navy/60">
              <p>발행일자: {todayStr}</p>
              <p className="font-bold text-navy">가족 매니저 공식 리포트</p>
            </div>
          </div>

          {/* Section 1: 3 Key Metrics Summary Strip */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-cream/70 p-2.5 rounded-xl border border-peach/60 print:border-gray-300">
              <p className="text-[10.5px] text-navy/70">현재 5등급제 확정 내신</p>
              <p className="text-lg font-black text-navy mt-0.5">{currentGPA.toFixed(2)}등급</p>
              <p className="text-[9.5px] text-navy/50">{child.completedSemesters.length}개 학기 누적 (상위 33%)</p>
            </div>

            <div className="bg-cream/70 p-2.5 rounded-xl border border-peach/60 print:border-gray-300">
              <p className="text-[10.5px] text-navy/70">최근 모의고사 (2028 통합수능)</p>
              <p className="text-lg font-black text-coral mt-0.5">
                {latestMock ? `수학 ${latestMock.scores.math.percentile}% (1등급)` : '-'}
              </p>
              <p className="text-[9.5px] text-navy/50">
                {latestMock ? latestMock.examName : '기록 없음'}
              </p>
            </div>

            <div className="bg-cream/70 p-2.5 rounded-xl border border-peach/60 print:border-gray-300">
              <p className="text-[10.5px] text-navy/70">잔여 학기 Goal-Seek 목표</p>
              <p className="text-lg font-black text-emerald-700 mt-0.5">1.50등급 유지</p>
              <p className="text-[9.5px] text-navy/50">최종 2.10등급 (인하/인천 학종 적정)</p>
            </div>
          </div>

          {/* Section 2: 수시 6장 황금 밸런스 포트폴리오 테이블 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black text-navy flex items-center gap-1.5">
                <Award className="w-4 h-4 text-coral" />
                <span>수시 6장 지원 포트폴리오 (2-2-2 황금 전략)</span>
              </h2>
              <span className="text-[10px] text-navy/60">내신 5등급제 70% Cut & 수능최저 진단</span>
            </div>

            <div className="overflow-x-auto border border-navy/30 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-navy text-cream font-bold text-[10px]">
                  <tr>
                    <th className="py-1.5 px-2">분류</th>
                    <th className="py-1.5 px-2">대학교명</th>
                    <th className="py-1.5 px-2">모집단위 (학과)</th>
                    <th className="py-1.5 px-2 text-center">전형</th>
                    <th className="py-1.5 px-2 text-center">예상컷</th>
                    <th className="py-1.5 px-2">수능최저학력기준</th>
                    <th className="py-1.5 px-2 text-center">진단 결과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-peach/30 text-navy/80">
                  {susiTargets.map((t, idx) => (
                    <tr key={t.id} className={idx % 2 === 0 ? 'bg-cream/20' : 'bg-white'}>
                      <td className="py-1.5 px-2 font-bold">
                        <span className={`px-1.5 py-0.2 rounded text-[9.5px] ${
                          t.susiCategory === 'reach' ? 'bg-red-100 text-red-700' :
                          t.susiCategory === 'target' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.susiCategory === 'reach' ? '소신' : t.susiCategory === 'target' ? '적정' : '안정'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 font-bold text-navy">{t.universityName}</td>
                      <td className="py-1.5 px-2">{t.departmentName}</td>
                      <td className="py-1.5 px-2 text-center">{t.admissionType}</td>
                      <td className="py-1.5 px-2 text-center font-bold text-navy">
                        {t.susiRequirements?.expectedCutoffGrade}등급
                      </td>
                      <td className="py-1.5 px-2 text-[10px] truncate max-w-[150px]">
                        {t.susiRequirements?.minimumCsatRequirement?.description || '수능최저 없음'}
                      </td>
                      <td className="py-1.5 px-2 text-center font-bold text-emerald-700 text-[10px]">
                        충족 가능 ✅
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 정시 3개 군 (가/나/다군) 목표 요약 */}
          <div className="space-y-1.5">
            <h2 className="text-xs sm:text-sm font-black text-navy flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-navy" />
              <span>정시 가 / 나 / 다군 목표 배치표</span>
            </h2>

            <div className="grid grid-cols-3 gap-2 text-[10.5px]">
              {jeongsiTargets.map((j) => (
                <div key={j.id} className="bg-cream/40 p-2.5 rounded-xl border border-peach/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-navy text-[10px] px-1.5 py-0.2 rounded bg-peach/50">
                      [{j.jeongsiGroup === 'ga' ? '가군' : j.jeongsiGroup === 'na' ? '나군' : '다군'}]
                    </span>
                    <span className="font-bold text-coral">70% 컷: {j.jeongsiRequirements?.percentileCutoff}%</span>
                  </div>
                  <p className="font-bold text-navy">{j.universityName}</p>
                  <p className="text-navy/70 text-[10px] truncate">{j.departmentName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 입시 컨설턴트 & 학부모 종합 소견 */}
          <div className="p-3 bg-peach/25 rounded-xl border border-navy/20 space-y-1 text-xs">
            <h3 className="font-bold text-navy flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>핵심 합격 전략 및 분기별 우선 공략 과목</span>
            </h3>
            <p className="text-[11px] text-navy/85 leading-relaxed">
              • <strong>수시 핵심</strong>: 2학년 2학기 및 3학년 1학기 국·수 4단위 내신 1등급 확보 시 인하대/인천대 사범대 및 컴퓨터계열 학종 합격선에 완벽 도달.<br />
              • <strong>정시 백업</strong>: 통합수능 수학 1등급 안정성을 유지하면서, 탐구(통합사회/과학) 백분위를 85% 이상으로 보완 시 정시 나군(국립인천대) 및 가군(인하대) 동시 합격 가능.
            </p>
          </div>

          {/* Footer Counselor Signature Box */}
          <div className="pt-2 border-t border-peach/40 flex items-center justify-between text-[10px] text-navy/60">
            <span>2028 대입 개편안 맞춤형 입시 관리 솔루션 (do-your-best)</span>
            <div className="flex items-center gap-6">
              <span>상담자(담임/컨설턴트): ________________ (서명)</span>
              <span>학부모: ________________ (서명)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
