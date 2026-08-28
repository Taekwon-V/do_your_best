'use client';

import React from 'react';
import { MockExamRecord } from '@/types/admissions';
import { Plus, Edit2, Trash2, Calendar, FileText, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface MockExamTableProps {
  mockExams?: MockExamRecord[];
  targetPercentile?: number;
  targetUniversityName?: string;
  targetWeights?: {
    korean: number;
    math: number;
    inquiry: number;
    english?: number;
    history?: number;
  };
  onAddClick: () => void;
  onEditClick: (exam: MockExamRecord) => void;
  onDeleteClick: (examId: string) => void;
}

export default function MockExamTable({
  mockExams = [],
  targetPercentile = 85.0,
  targetUniversityName = '인하대학교 수학교육과',
  targetWeights = { korean: 25, math: 40, inquiry: 25, english: 0, history: 0 },
  onAddClick,
  onEditClick,
  onDeleteClick,
}: MockExamTableProps) {
  // Sort descending by examDate
  const sortedExams = [...mockExams].sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );

  // Helper to compute university weighted percentile
  const computeWeightedScore = (exam?: MockExamRecord | null) => {
    if (!exam || !exam.scores) return 0;

    const mathPct = exam.scores.math?.percentile ?? 0;
    const koreanPct = exam.scores.korean?.percentile ?? 0;
    const socPct = exam.scores.integratedSocial?.percentile ?? 0;
    const sciPct = exam.scores.integratedScience?.percentile ?? 0;
    const tamguPct = (socPct + sciPct) / 2;

    const wKor = targetWeights?.korean || 25;
    const wMat = targetWeights?.math || 40;
    const wInq = targetWeights?.inquiry || 25;
    const totalW = wKor + wMat + wInq || 100;

    const weighted = (koreanPct * wKor + mathPct * wMat + tamguPct * wInq) / totalW;
    return Number(weighted.toFixed(1));
  };

  const wKor = targetWeights?.korean || 25;
  const wMat = targetWeights?.math || 40;
  const wInq = targetWeights?.inquiry || 25;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-peach/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-peach/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-peach/30 flex items-center justify-center text-midnight">
            <FileText className="w-4 h-4 text-midnight" />
          </div>
          <div>
            <h3 className="font-bold text-midnight text-base sm:text-lg">
              2028 통합수능 모의고사 성적 대장
            </h3>
            <p className="text-xs text-midnight/60">
              고1·고2 학력평가 및 고3 모의평가 회차별 성적 관리 (총 {mockExams.length}회 기록)
            </p>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-coral text-white font-bold text-xs sm:text-sm hover:opacity-90 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 모의고사 성적 추가</span>
        </button>
      </div>

      {/* Table */}
      {sortedExams.length === 0 ? (
        <div className="py-8 text-center text-midnight/50 text-xs">
          등록된 모의고사 기록이 없습니다. 상단의 버튼을 눌러 성적을 등록해 주세요.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-peach/50 scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[720px] sm:min-w-[840px]">
            <thead>
              <tr className="bg-cream/80 text-midnight font-bold border-b border-peach/40">
                <th className="py-2.5 px-3">시험명 / 일자</th>
                <th className="py-2.5 px-2.5 text-center">국어(공통)</th>
                <th className="py-2.5 px-2.5 text-center">수학(공통)</th>
                <th className="py-2.5 px-2.5 text-center">영어(절대)</th>
                <th className="py-2.5 px-2.5 text-center">한국사</th>
                <th className="py-2.5 px-2.5 text-center">통합사회</th>
                <th className="py-2.5 px-2.5 text-center">통합과학</th>
                {/* 🌟 Special Target University Weighted Column */}
                <th className="py-2.5 px-3 text-center bg-indigo-50/80 border-x border-indigo-100 min-w-[150px]">
                  <div className="flex items-center justify-center gap-1 text-indigo-900 font-black">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>목표대학 맞춤 환산점</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-normal block truncate">
                    {targetUniversityName} (컷 {targetPercentile}%)
                  </span>
                </th>
                <th className="py-2.5 px-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-peach/30">
              {sortedExams.map((exam) => {
                const weightedScore = computeWeightedScore(exam);
                const gap = Number((weightedScore - targetPercentile).toFixed(1));
                const isPass = gap >= 0;

                return (
                  <tr key={exam.id} className="hover:bg-cream/40 transition-colors">
                    {/* Exam Name & Date */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-midnight text-xs sm:text-sm">
                        {exam.examName}
                      </p>
                      <p className="text-[11px] text-midnight/60 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{exam.examDate}</span>
                      </p>
                    </td>

                    {/* Korean */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="font-bold text-midnight block">
                        {exam.scores?.korean?.percentile !== undefined ? `${exam.scores.korean.percentile}%` : '-'}
                      </span>
                      {exam.scores?.korean?.grade && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded font-bold bg-navy/10 text-navy">
                          {exam.scores.korean.grade}등급
                        </span>
                      )}
                    </td>

                    {/* Math */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="font-bold text-coral block">
                        {exam.scores?.math?.percentile !== undefined ? `${exam.scores.math.percentile}%` : '-'}
                      </span>
                      {exam.scores?.math?.grade && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded font-bold bg-coral/15 text-coral">
                          {exam.scores.math.grade}등급
                        </span>
                      )}
                    </td>

                    {/* English */}
                    <td className="py-3 px-2.5 text-center">
                      {exam.scores?.english?.grade ? (
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-pastel-yellow text-midnight border border-peach/50">
                          {exam.scores.english.grade}등급
                        </span>
                      ) : '-'}
                    </td>

                    {/* Korean History */}
                    <td className="py-3 px-2.5 text-center">
                      {exam.scores?.koreanHistory?.grade ? (
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-pastel-yellow text-midnight border border-peach/50">
                          {exam.scores.koreanHistory.grade}등급
                        </span>
                      ) : '-'}
                    </td>

                    {/* Integrated Social */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="font-semibold text-midnight block">
                        {exam.scores?.integratedSocial?.percentile !== undefined ? `${exam.scores.integratedSocial.percentile}%` : '-'}
                      </span>
                      {exam.scores?.integratedSocial?.grade && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-900">
                          {exam.scores.integratedSocial.grade}등급
                        </span>
                      )}
                    </td>

                    {/* Integrated Science */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="font-semibold text-midnight block">
                        {exam.scores?.integratedScience?.percentile !== undefined ? `${exam.scores.integratedScience.percentile}%` : '-'}
                      </span>
                      {exam.scores?.integratedScience?.grade && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-900">
                          {exam.scores.integratedScience.grade}등급
                        </span>
                      )}
                    </td>

                    {/* 🎯 Target University Specific Weighted Score Cell */}
                    <td className="py-3 px-3 text-center bg-indigo-50/40 border-x border-indigo-100">
                      <div className="font-black text-sm text-indigo-950">
                        {weightedScore}%
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {isPass ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>+{Math.abs(gap)}%p 도달</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>{Math.abs(gap)}%p 부족</span>
                            </>
                          )}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-indigo-700 font-semibold block mt-0.5">
                        국{wKor}·수{wMat}·탐{wInq}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditClick(exam)}
                          title="수정"
                          className="p-1.5 rounded-lg hover:bg-peach/40 text-midnight/70 hover:text-midnight transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(exam.id)}
                          title="삭제"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-midnight/50 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
