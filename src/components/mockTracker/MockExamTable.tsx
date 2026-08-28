'use client';

import React from 'react';
import { MockExamRecord } from '@/types/admissions';
import { Plus, Edit2, Trash2, Calendar, FileText } from 'lucide-react';

interface MockExamTableProps {
  mockExams: MockExamRecord[];
  onAddClick: () => void;
  onEditClick: (exam: MockExamRecord) => void;
  onDeleteClick: (examId: string) => void;
}

export default function MockExamTable({
  mockExams = [],
  onAddClick,
  onEditClick,
  onDeleteClick,
}: MockExamTableProps) {
  // Sort descending by examDate
  const sortedExams = [...mockExams].sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-cream/80 text-midnight font-bold border-b border-peach/40">
                <th className="py-2.5 px-3 rounded-l-xl">시험명 / 시행일자</th>
                <th className="py-2.5 px-3 text-center">국어(공통)</th>
                <th className="py-2.5 px-3 text-center">수학(공통)</th>
                <th className="py-2.5 px-3 text-center">영어(절대)</th>
                <th className="py-2.5 px-3 text-center">한국사</th>
                <th className="py-2.5 px-3 text-center">통합사회</th>
                <th className="py-2.5 px-3 text-center">통합과학</th>
                <th className="py-2.5 px-3 rounded-r-xl text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-peach/30">
              {sortedExams.map((exam) => (
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

                  {/* 국어 */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-midnight text-xs block">
                      {exam.scores.korean.percentile ?? '-'}%
                    </span>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-midnight/10 text-midnight font-bold">
                      {exam.scores.korean.grade}등급
                    </span>
                  </td>

                  {/* 수학 */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-coral text-xs block">
                      {exam.scores.math.percentile ?? '-'}%
                    </span>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-coral/20 text-coral font-bold">
                      {exam.scores.math.grade}등급
                    </span>
                  </td>

                  {/* 영어 */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-lg bg-cream font-bold text-midnight border border-peach/50">
                      {exam.scores.english.grade}등급
                    </span>
                  </td>

                  {/* 한국사 */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-lg bg-cream font-bold text-midnight/80 border border-peach/50">
                      {exam.scores.koreanHistory.grade}등급
                    </span>
                  </td>

                  {/* 통합사회 */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-amber-700 text-xs block">
                      {exam.scores.integratedSocial.percentile ?? '-'}%
                    </span>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      {exam.scores.integratedSocial.grade}등급
                    </span>
                  </td>

                  {/* 통합과학 */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-emerald-700 text-xs block">
                      {exam.scores.integratedScience.percentile ?? '-'}%
                    </span>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {exam.scores.integratedScience.grade}등급
                    </span>
                  </td>

                  {/* Edit / Delete Actions */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEditClick(exam)}
                        className="p-1.5 rounded-lg text-midnight/60 hover:text-midnight hover:bg-peach/30 transition-colors"
                        title="성적 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(exam.id)}
                        className="p-1.5 rounded-lg text-midnight/40 hover:text-coral hover:bg-coral/10 transition-colors"
                        title="성적 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
