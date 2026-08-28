'use client';

import React, { useState, useEffect } from 'react';
import { MockExamRecord } from '@/types/admissions';
import { X, Sparkles } from 'lucide-react';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: MockExamRecord) => void;
  initialData?: MockExamRecord | null;
  currentGradeLevel?: 1 | 2 | 3;
}

export default function MockExamModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentGradeLevel = 2,
}: MockExamModalProps) {
  const [examName, setExamName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<1 | 2 | 3>(currentGradeLevel);
  const [examMonth, setExamMonth] = useState<3 | 5 | 6 | 7 | 9 | 10 | 11>(6);
  const [examDate, setExamDate] = useState('');

  // 6개 과목 상태
  const [korean, setKorean] = useState({ standardScore: 130, percentile: 90, grade: 2, rawScore: 85 });
  const [math, setMath] = useState({ standardScore: 132, percentile: 92, grade: 1, rawScore: 88 });
  const [english, setEnglish] = useState({ rawScore: 90, grade: 1 });
  const [koreanHistory, setKoreanHistory] = useState({ rawScore: 40, grade: 1 });
  const [social, setSocial] = useState({ standardScore: 65, percentile: 90, grade: 2, rawScore: 42 });
  const [science, setScience] = useState({ standardScore: 65, percentile: 90, grade: 2, rawScore: 42 });

  useEffect(() => {
    if (initialData) {
      setExamName(initialData.examName);
      setGradeLevel(initialData.gradeLevel);
      setExamMonth(initialData.examMonth);
      setExamDate(initialData.examDate);

      setKorean({
        standardScore: initialData.scores.korean.standardScore ?? 130,
        percentile: initialData.scores.korean.percentile ?? 90,
        grade: initialData.scores.korean.grade ?? 2,
        rawScore: 85,
      });
      setMath({
        standardScore: initialData.scores.math.standardScore ?? 130,
        percentile: initialData.scores.math.percentile ?? 90,
        grade: initialData.scores.math.grade ?? 2,
        rawScore: 85,
      });
      setEnglish({
        rawScore: initialData.scores.english.rawScore ?? 90,
        grade: initialData.scores.english.grade ?? 1,
      });
      setKoreanHistory({
        rawScore: initialData.scores.koreanHistory.rawScore ?? 40,
        grade: initialData.scores.koreanHistory.grade ?? 1,
      });
      setSocial({
        standardScore: initialData.scores.integratedSocial.standardScore ?? 65,
        percentile: initialData.scores.integratedSocial.percentile ?? 90,
        grade: initialData.scores.integratedSocial.grade ?? 2,
        rawScore: 40,
      });
      setScience({
        standardScore: initialData.scores.integratedScience.standardScore ?? 65,
        percentile: initialData.scores.integratedScience.percentile ?? 90,
        grade: initialData.scores.integratedScience.grade ?? 2,
        rawScore: 40,
      });
    } else {
      const year = new Date().getFullYear();
      setExamName(`${year}년 고${currentGradeLevel} 9월 학력평가`);
      setGradeLevel(currentGradeLevel);
      setExamMonth(9);
      setExamDate(`${year}-09-09`);
    }
  }, [initialData, currentGradeLevel, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: MockExamRecord = {
      id: initialData ? initialData.id : `mock-${Date.now()}`,
      gradeLevel,
      examMonth,
      examName: examName.trim() || `고${gradeLevel} ${examMonth}월 모의평가`,
      examDate: examDate || new Date().toISOString().split('T')[0],
      scores: {
        korean: {
          standardScore: Number(korean.standardScore),
          percentile: Number(korean.percentile),
          grade: Number(korean.grade),
        },
        math: {
          standardScore: Number(math.standardScore),
          percentile: Number(math.percentile),
          grade: Number(math.grade),
        },
        english: {
          rawScore: Number(english.rawScore),
          grade: Number(english.grade),
        },
        koreanHistory: {
          rawScore: Number(koreanHistory.rawScore),
          grade: Number(koreanHistory.grade),
        },
        integratedSocial: {
          standardScore: Number(social.standardScore),
          percentile: Number(social.percentile),
          grade: Number(social.grade),
        },
        integratedScience: {
          standardScore: Number(science.standardScore),
          percentile: Number(science.percentile),
          grade: Number(science.grade),
        },
      },
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-peach/50 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-peach/30 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-midnight">
              {initialData ? '모의고사 성적 수정' : '2028 통합수능 모의고사 성적 등록'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-peach/30 text-midnight/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Exam Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-cream/50 p-3.5 rounded-2xl border border-peach/40">
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">
                시험명
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="예: 2026년 고2 9월 학력평가"
                required
                className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">
                학년 / 시행월
              </label>
              <div className="flex gap-2">
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-1/2 bg-white border border-peach/60 rounded-xl px-2 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value={1}>고1</option>
                  <option value={2}>고2</option>
                  <option value={3}>고3</option>
                </select>
                <select
                  value={examMonth}
                  onChange={(e) => setExamMonth(Number(e.target.value) as 3 | 5 | 6 | 7 | 9 | 10 | 11)}
                  className="w-1/2 bg-white border border-peach/60 rounded-xl px-2 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  {[3, 5, 6, 7, 9, 10, 11].map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">
                시험 시행일자
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
                className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
          </div>

          {/* 6 Subjects Score Inputs */}
          <div>
            <h4 className="font-bold text-midnight text-xs mb-2.5 flex items-center justify-between">
              <span>2028 통합수능 6개 과목 성적 입력</span>
              <span className="text-[11px] font-normal text-midnight/60">
                표준점수 및 백분위는 성적표 기준
              </span>
            </h4>

            <div className="space-y-2.5">
              {/* 국어 (공통) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  국어 (공통)
                </span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">표준점수</span>
                    <input
                      type="number"
                      value={korean.standardScore}
                      onChange={(e) => setKorean({ ...korean, standardScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">백분위(%)</span>
                    <input
                      type="number"
                      value={korean.percentile}
                      onChange={(e) => setKorean({ ...korean, percentile: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-coral"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={korean.grade}
                      onChange={(e) => setKorean({ ...korean, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* 수학 (공통) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  수학 (공통)
                </span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">표준점수</span>
                    <input
                      type="number"
                      value={math.standardScore}
                      onChange={(e) => setMath({ ...math, standardScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">백분위(%)</span>
                    <input
                      type="number"
                      value={math.percentile}
                      onChange={(e) => setMath({ ...math, percentile: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-coral"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={math.grade}
                      onChange={(e) => setMath({ ...math, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* 영어 (절대평가) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  영어 (절대평가)
                </span>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">원점수 (100만점)</span>
                    <input
                      type="number"
                      value={english.rawScore}
                      onChange={(e) => setEnglish({ ...english, rawScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급 (1~9)</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={english.grade}
                      onChange={(e) => setEnglish({ ...english, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* 한국사 (절대평가) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  한국사 (절대)
                </span>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">원점수 (50만점)</span>
                    <input
                      type="number"
                      value={koreanHistory.rawScore}
                      onChange={(e) => setKoreanHistory({ ...koreanHistory, rawScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급 (1~9)</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={koreanHistory.grade}
                      onChange={(e) => setKoreanHistory({ ...koreanHistory, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* 통합사회 (공통) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  통합사회 (공통)
                </span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">표준점수</span>
                    <input
                      type="number"
                      value={social.standardScore}
                      onChange={(e) => setSocial({ ...social, standardScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">백분위(%)</span>
                    <input
                      type="number"
                      value={social.percentile}
                      onChange={(e) => setSocial({ ...social, percentile: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-amber-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={social.grade}
                      onChange={(e) => setSocial({ ...social, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* 통합과학 (공통) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-peach/40">
                <span className="font-bold text-midnight text-xs sm:w-28 shrink-0">
                  통합과학 (공통)
                </span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div>
                    <span className="text-[10px] text-midnight/60 block">표준점수</span>
                    <input
                      type="number"
                      value={science.standardScore}
                      onChange={(e) => setScience({ ...science, standardScore: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">백분위(%)</span>
                    <input
                      type="number"
                      value={science.percentile}
                      onChange={(e) => setScience({ ...science, percentile: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-midnight/60 block">등급</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={science.grade}
                      onChange={(e) => setScience({ ...science, grade: Number(e.target.value) })}
                      className="w-full border border-peach/60 rounded-lg px-2 py-1 text-center font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-peach/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-peach/30 text-midnight font-bold hover:bg-peach/50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-coral text-white font-bold hover:opacity-90 shadow-sm transition-all"
            >
              {initialData ? '수정 완료' : '성적 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
