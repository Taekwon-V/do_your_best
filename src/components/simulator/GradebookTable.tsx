'use client';

import React, { useState, useMemo } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { SemesterKey, SubjectCategory, SemesterCourseGrade, AchievementLevel, RankGrade5 } from '@/types/admissions';
import { GRADE_5_PERCENTILES, calculateSemesterGPA } from '@/utils/gpaCalculator';
import { Plus, Trash2, Edit2, Check, Sparkles, BookOpen, Wand2 } from 'lucide-react';

const SEMESTER_TABS: { key: SemesterKey; label: string }[] = [
  { key: '1-1', label: '1학년 1학기' },
  { key: '1-2', label: '1학년 2학기' },
  { key: '2-1', label: '2학년 1학기' },
  { key: '2-2', label: '2학년 2학기' },
  { key: '3-1', label: '3학년 1학기' },
];

const CATEGORIES: SubjectCategory[] = ['국어', '수학', '영어', '사회', '과학', '한국사', '기술가정/정보', '제2외국어/한문', '기타'];

export default function GradebookTable() {
  const { activeChild, addCourse, updateCourse, deleteCourse, calculateCumulativeGPA } = useAdmissions();
  
  // 기본 선택 탭: 현재 학년 기준 다음 학기 또는 최근 학기
  const [selectedSemester, setSelectedSemester] = useState<SemesterKey>(
    activeChild.currentGrade === 2 ? '2-2' : '1-2'
  );

  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseCategory, setNewCourseCategory] = useState<SubjectCategory>('국어');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseUnits, setNewCourseUnits] = useState<number>(4);
  const [newCourseGrade, setNewCourseGrade] = useState<RankGrade5>(1);
  const [newCourseAchievement, setNewCourseAchievement] = useState<AchievementLevel>('A');

  // 현재 선택된 학기의 과목 목록
  const semesterCourses = useMemo(() => {
    return activeChild.courses.filter((c) => c.semester === selectedSemester);
  }, [activeChild.courses, selectedSemester]);

  // 학기 성적 요약
  const semesterStats = useMemo(() => {
    return calculateSemesterGPA(activeChild.courses, selectedSemester);
  }, [activeChild.courses, selectedSemester]);

  // 확정 학기 여부
  const isCompletedSemester = activeChild.completedSemesters.includes(selectedSemester);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      alert('과목명을 입력해 주세요.');
      return;
    }

    const newCourse: SemesterCourseGrade = {
      id: `c-${Date.now()}`,
      semester: selectedSemester,
      category: newCourseCategory,
      courseName: newCourseName.trim(),
      unitCount: newCourseUnits,
      rankGrade: newCourseGrade,
      achievement: newCourseAchievement,
      isSimulated: !isCompletedSemester,
    };

    addCourse(activeChild.id, newCourse);
    setNewCourseName('');
    setIsAddingCourse(false);
  };

  // 1초 만에 전과목 일괄 설정 (시뮬레이션 마법봉 기능)
  const handleQuickFill = (targetGrade: RankGrade5) => {
    // 기존 과목이 있으면 등급만 변경, 없으면 표준 기본 과목 자동 생성
    if (semesterCourses.length > 0) {
      semesterCourses.forEach((c) => {
        updateCourse(activeChild.id, {
          ...c,
          rankGrade: targetGrade,
          achievement: targetGrade === 1 ? 'A' : targetGrade === 2 ? 'A' : 'B',
          isSimulated: !isCompletedSemester,
        });
      });
    } else {
      const defaultSubjects: { name: string; cat: SubjectCategory; units: number }[] = [
        { name: `${selectedSemester} 국어`, cat: '국어', units: 4 },
        { name: `${selectedSemester} 수학`, cat: '수학', units: 4 },
        { name: `${selectedSemester} 영어`, cat: '영어', units: 4 },
        { name: `${selectedSemester} 탐구1`, cat: '과학', units: 4 },
      ];
      defaultSubjects.forEach((sub, idx) => {
        addCourse(activeChild.id, {
          id: `c-quick-${Date.now()}-${idx}`,
          semester: selectedSemester,
          category: sub.cat,
          courseName: sub.name,
          unitCount: sub.units,
          rankGrade: targetGrade,
          achievement: targetGrade <= 2 ? 'A' : 'B',
          isSimulated: !isCompletedSemester,
        });
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-navy p-5 sm:p-7 shadow-retro-lg space-y-6">
      
      {/* 1. 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-navy/15">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky border-2 border-navy flex items-center justify-center shadow-retro shrink-0">
            <BookOpen className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-navy tracking-tight">
              학기별 5등급제 성적표 & 시뮬레이션 테이블
            </h2>
            <p className="text-xs text-navy-muted font-medium">
              과목별 단위수와 5등급제 석차등급을 실시간으로 입력하고 편집합니다.
            </p>
          </div>
        </div>

        {/* 미래 학기 마법봉 채우기 툴 */}
        {!isCompletedSemester && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-navy-muted flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-coral" /> 빠른 역산 채우기:
            </span>
            <button
              onClick={() => handleQuickFill(1)}
              className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded-lg text-xs font-black"
            >
              올 1등급 (10%)
            </button>
            <button
              onClick={() => handleQuickFill(2)}
              className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-navy border border-sky-400 rounded-lg text-xs font-black"
            >
              올 2등급 (34%)
            </button>
          </div>
        )}
      </div>

      {/* 2. 학기 탭 스위처 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {SEMESTER_TABS.map((tab) => {
          const isCompleted = activeChild.completedSemesters.includes(tab.key);
          const isSelected = selectedSemester === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedSemester(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-navy text-cream border-navy shadow-retro'
                  : isCompleted
                  ? 'bg-cream text-navy border-navy/30 hover:bg-peach/40'
                  : 'bg-peach/30 text-navy-muted border-dashed border-navy/40 hover:bg-peach/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isCompleted
                    ? 'bg-sky text-navy'
                    : 'bg-coral text-navy'
                }`}
              >
                {isCompleted ? '확정' : '역산 🔮'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. 학기 요약 인포 바 */}
      <div className="p-3.5 bg-cream/70 rounded-2xl border border-navy/20 flex flex-wrap items-center justify-between gap-3 text-xs text-navy font-bold">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-navy-muted">해당 학기 이수 단위: </span>
            <span className="font-black text-sm text-navy">{semesterStats.units} 단위</span>
          </div>
          <div>
            <span className="text-navy-muted">해당 학기 가중평균: </span>
            <span className="px-2 py-0.5 bg-white rounded-lg border border-navy font-black text-sm text-navy">
              {semesterStats.gpa > 0 ? `${semesterStats.gpa} 등급` : '과목 없음'}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-navy-muted">
          {isCompletedSemester
            ? '✅ 학교생활기록부 확정 성적입니다.'
            : '🔮 미래 목표 시뮬레이션용 가상 학기입니다. 언제든 자유롭게 수정해 보세요.'}
        </span>
      </div>

      {/* 4. 과목 성적표 테이블 */}
      <div className="overflow-x-auto rounded-2xl border-2 border-navy">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-peach/60 border-b-2 border-navy text-navy font-black">
            <tr>
              <th className="py-3 px-3 sm:px-4">교과 구분</th>
              <th className="py-3 px-3 sm:px-4">과목명</th>
              <th className="py-3 px-3 sm:px-4 text-center">단위수</th>
              <th className="py-3 px-3 sm:px-4 text-center">2028 5등급제 석차등급</th>
              <th className="py-3 px-3 sm:px-4 text-center">성취도</th>
              <th className="py-3 px-3 sm:px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/15 bg-white">
            {semesterCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-navy-muted">
                  등록된 과목이 없습니다. 아래 <strong>[+ 과목 추가]</strong> 버튼으로 과목을 등록해 보세요.
                </td>
              </tr>
            ) : (
              semesterCourses.map((course) => {
                const gradeInfo = course.rankGrade ? GRADE_5_PERCENTILES[course.rankGrade] : null;
                return (
                  <tr key={course.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-bold text-navy-muted">
                      <span className="px-2 py-0.5 bg-cream rounded-md border border-navy/20 text-[11px]">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-black text-navy">
                      {course.courseName}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-navy">
                      {/* 단위수 인라인 수정 */}
                      <select
                        value={course.unitCount}
                        onChange={(e) =>
                          updateCourse(activeChild.id, {
                            ...course,
                            unitCount: parseInt(e.target.value) || 1,
                          })
                        }
                        className="p-1 rounded-lg border border-navy/30 bg-white font-black text-xs text-navy focus:outline-none focus:border-navy"
                      >
                        {[1, 2, 3, 4, 5, 6].map((u) => (
                          <option key={u} value={u}>
                            {u}단위
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      {/* 5등급제 등급 셀렉터 */}
                      <select
                        value={course.rankGrade || 1}
                        onChange={(e) =>
                          updateCourse(activeChild.id, {
                            ...course,
                            rankGrade: parseInt(e.target.value) as RankGrade5,
                          })
                        }
                        className="p-1 px-2 rounded-lg border border-navy/30 bg-white font-black text-xs text-navy focus:outline-none focus:border-navy"
                      >
                        {[1, 2, 3, 4, 5].map((g) => (
                          <option key={g} value={g}>
                            {g}등급 ({GRADE_5_PERCENTILES[g].cumulativePercent})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <select
                        value={course.achievement || 'A'}
                        onChange={(e) =>
                          updateCourse(activeChild.id, {
                            ...course,
                            achievement: e.target.value as AchievementLevel,
                          })
                        }
                        className="p-1 px-2 rounded-lg border border-navy/30 bg-white font-black text-xs text-navy focus:outline-none focus:border-navy"
                      >
                        {['A', 'B', 'C', 'D', 'E'].map((ach) => (
                          <option key={ach} value={ach}>
                            {ach}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <button
                        onClick={() => deleteCourse(activeChild.id, course.id)}
                        className="p-1.5 rounded-lg text-navy-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="과목 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. 과목 추가 인라인 폼 */}
      {isAddingCourse ? (
        <form
          onSubmit={handleAddCourse}
          className="p-4 bg-cream rounded-2xl border-2 border-navy space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-navy flex items-center gap-1">
              <Plus className="w-4 h-4 text-coral" /> {selectedSemester}학기 새 과목 추가
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCourse(false)}
              className="text-xs text-navy-muted hover:text-navy underline"
            >
              취소
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-navy-muted font-bold mb-1">교과 구분</label>
              <select
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value as SubjectCategory)}
                className="w-full p-2 bg-white border border-navy rounded-xl font-bold text-navy"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-2">
              <label className="block text-navy-muted font-bold mb-1">과목명</label>
              <input
                type="text"
                placeholder="예: 공통수학, 물리학, 대수 등"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full p-2 bg-white border border-navy rounded-xl font-bold text-navy placeholder:text-navy/30"
              />
            </div>

            <div>
              <label className="block text-navy-muted font-bold mb-1">단위수</label>
              <select
                value={newCourseUnits}
                onChange={(e) => setNewCourseUnits(parseInt(e.target.value))}
                className="w-full p-2 bg-white border border-navy rounded-xl font-bold text-navy"
              >
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <option key={u} value={u}>
                    {u}단위
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-navy-muted font-bold mb-1">석차 등급</label>
              <select
                value={newCourseGrade}
                onChange={(e) => setNewCourseGrade(parseInt(e.target.value) as RankGrade5)}
                className="w-full p-2 bg-white border border-navy rounded-xl font-bold text-navy"
              >
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>
                    {g}등급 ({GRADE_5_PERCENTILES[g].cumulativePercent})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-coral hover:bg-coral-hover text-navy font-black rounded-xl border-2 border-navy shadow-retro text-xs transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>과목 등록 완료</span>
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingCourse(true)}
          className="w-full py-3 bg-cream hover:bg-peach/40 text-navy font-black rounded-2xl border-2 border-dashed border-navy/40 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
        >
          <Plus className="w-4 h-4 text-coral" />
          <span>{selectedSemester}학기에 과목 추가하기</span>
        </button>
      )}

    </div>
  );
}
