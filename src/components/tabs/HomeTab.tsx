'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import {
  Target,
  TrendingUp,
  Award,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomeTab() {
  const { activeChild, setActiveTab, calculateCumulativeGPA, calculateDDay } = useAdmissions();

  const currentGPA = calculateCumulativeGPA(activeChild.courses || []);
  const mockExams = activeChild.mockExams || [];
  const latestMock = mockExams.length > 0
    ? [...mockExams].sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())[0]
    : null;

  const targetUnivs = activeChild.targetUniversities || [];
  const susiTargets = targetUnivs.filter((t) => t.type === 'susi');

  const mainDDay = activeChild.dDayMilestones?.[0];
  const daysLeft = mainDDay ? calculateDDay(mainDDay.targetDate) : 0;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Top Summary Hero Card */}
      <div className="bg-navy rounded-3xl p-5 sm:p-7 text-cream shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-coral/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-coral text-navy">
                {activeChild.name} 대입 종합 상황판
              </span>
              <span className="text-xs text-cream/70">
                {activeChild.targetAdmissionYear}학년도 대입 개편안 적용
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-cream tracking-tight">
              목표: {activeChild.targetMajorField}
            </h1>
          </div>

          {/* D-Day Counter Chip */}
          {mainDDay && (
            <div className="flex items-center gap-2.5 bg-cream/10 border border-cream/20 px-4 py-2.5 rounded-2xl shrink-0">
              <Calendar className="w-5 h-5 text-coral" />
              <div>
                <p className="text-[10px] text-cream/60 leading-none">{mainDDay.title}</p>
                <p className="text-lg sm:text-xl font-black text-coral leading-tight mt-0.5">
                  D-{daysLeft > 0 ? daysLeft : 'DAY'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3 Key Stats Row (모바일 3컬럼 미니 카드) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-3.5 border-t border-cream/15 text-center">
          <div className="bg-cream/10 p-2 sm:p-3 rounded-2xl border border-cream/15">
            <p className="text-[10px] sm:text-[11px] text-cream/70 truncate">확정 내신</p>
            <p className="text-base sm:text-2xl font-black text-sky-light mt-0.5">
              {currentGPA.toFixed(2)}
              <span className="text-[10px] sm:text-xs font-bold text-cream/70 ml-0.5">등급</span>
            </p>
            <p className="text-[9px] sm:text-[10px] text-cream/60 mt-0.5 truncate">
              {activeChild.completedSemesters.length}개 학기
            </p>
          </div>

          <div className="bg-cream/10 p-2 sm:p-3 rounded-2xl border border-cream/15">
            <p className="text-[10px] sm:text-[11px] text-cream/70 truncate">최근 모의고사</p>
            <p className="text-base sm:text-2xl font-black text-amber-300 mt-0.5">
              {latestMock ? `${latestMock.scores.math.percentile}%` : '-'}
            </p>
            <p className="text-[9px] sm:text-[10px] text-cream/60 mt-0.5 truncate">
              {latestMock ? latestMock.examName.replace(/20\d\d년\s*/, '') : '기록 없음'}
            </p>
          </div>

          <div className="bg-cream/10 p-2 sm:p-3 rounded-2xl border border-cream/15">
            <p className="text-[10px] sm:text-[11px] text-cream/70 truncate">수시 6장</p>
            <p className="text-base sm:text-2xl font-black text-coral mt-0.5">
              {susiTargets.length}
              <span className="text-[10px] sm:text-xs font-bold text-cream/70 ml-0.5">/6</span>
            </p>
            <p className="text-[9px] sm:text-[10px] text-cream/60 mt-0.5 truncate">
              등록 완료
            </p>
          </div>
        </div>
      </div>

      {/* 2. 4 Quick Navigation Hub Cards (한눈에 기능 바로가기) */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-midnight mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-coral" />
          <span>핵심 대입 관리 기능 바로가기</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: 수시 내신 & 역산 */}
          <button
            onClick={() => setActiveTab('susi')}
            className="group bg-white p-4 sm:p-5 rounded-3xl border-2 border-peach/50 hover:border-navy text-left shadow-sm hover:shadow-retro transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-coral/20 flex items-center justify-center text-coral group-hover:scale-110 transition-transform shrink-0">
                <Target className="w-6 h-6 text-coral" />
              </div>
              <div>
                <h3 className="font-bold text-midnight text-sm sm:text-base">
                  수시 내신 & 역산 시뮬레이터
                </h3>
                <p className="text-xs text-midnight/60 mt-0.5">
                  남은 {activeChild.currentGrade === 2 ? '2개' : '4개'} 학기 Goal-Seek 목표 등급 및 성적표 관리
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-midnight/40 group-hover:text-navy group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Card 2: 정시 모의고사 & Gap */}
          <button
            onClick={() => setActiveTab('jeongsi')}
            className="group bg-white p-4 sm:p-5 rounded-3xl border-2 border-peach/50 hover:border-navy text-left shadow-sm hover:shadow-retro transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-pastel-sky/30 flex items-center justify-center text-midnight group-hover:scale-110 transition-transform shrink-0">
                <TrendingUp className="w-6 h-6 text-midnight" />
              </div>
              <div>
                <h3 className="font-bold text-midnight text-sm sm:text-base">
                  정시 모의고사 트래커 & Gap
                </h3>
                <p className="text-xs text-midnight/60 mt-0.5">
                  2028 통합수능 시계열 성장 차트 및 정시 컷 점수차 분석
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-midnight/40 group-hover:text-navy group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Card 3: 목표 대학 포트폴리오 */}
          <button
            onClick={() => setActiveTab('targets')}
            className="group bg-white p-4 sm:p-5 rounded-3xl border-2 border-peach/50 hover:border-navy text-left shadow-sm hover:shadow-retro transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform shrink-0">
                <Award className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="font-bold text-midnight text-sm sm:text-base">
                  목표 대학 포트폴리오 (6장+3군)
                </h3>
                <p className="text-xs text-midnight/60 mt-0.5">
                  수시 6장(안정/적정/소신) 및 정시 가나다군 수능최저 진단
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-midnight/40 group-hover:text-navy group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Card 4: 입결 DB & 1장 리포트 */}
          <button
            onClick={() => setActiveTab('reports')}
            className="group bg-white p-4 sm:p-5 rounded-3xl border-2 border-peach/50 hover:border-navy text-left shadow-sm hover:shadow-retro transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform shrink-0">
                <FileText className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-bold text-midnight text-sm sm:text-base">
                  입결 DB & 마스터 환산표
                </h3>
                <p className="text-xs text-midnight/60 mt-0.5">
                  인천대·인하대·중앙대 5등급제 입결 및 124단위 가중치 조견표
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-midnight/40 group-hover:text-navy group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>

      {/* 3. Emergency Strategic Feedback Box */}
      <div className="bg-peach/30 rounded-3xl p-4 sm:p-5 border-2 border-navy">
        <div className="flex items-center gap-2 mb-2 font-black text-navy text-sm sm:text-base">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>현재 {activeChild.name} 대입 전략 핵심 가이드</span>
        </div>
        <p className="text-xs sm:text-sm text-navy/80 leading-relaxed">
          {activeChild.currentGrade === 2 ? (
            <>
              • <strong>고2 첫째</strong>: 남은 2학기 동안 4단위 주요 과목(국어, 수학)을 1등급대로 끌어올리면 <strong>인하대/인천대 사범대 및 주요 공학 계열 학생부종합 면접형</strong> 합격 안정권에 도달합니다.
            </>
          ) : (
            <>
              • <strong>고1 둘째</strong>: 1학년 1학기 이후 4개 학기가 남아있으므로 장기적인 내신 상승 곡선과 수능 기본기(수학/영어)를 탄탄하게 구축하는 것이 최우선입니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
