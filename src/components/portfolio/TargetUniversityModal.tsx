'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TargetUniversity, SusiCategory, JeongsiGroup } from '@/types/admissions';
import { X, Sparkles, Building, BookOpen, ChevronRight, Check } from 'lucide-react';
import { UNIVERSITY_ADMISSIONS_DB, UniversityData, DepartmentAdmissionData } from '@/data/universityAdmissionsDB';

interface TargetUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: TargetUniversity) => void;
  initialData?: TargetUniversity | null;
  defaultType?: 'susi' | 'jeongsi';
  defaultSusiCategory?: SusiCategory;
  defaultJeongsiGroup?: JeongsiGroup;
}

export default function TargetUniversityModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultType = 'susi',
  defaultSusiCategory = 'target',
  defaultJeongsiGroup = 'ga',
}: TargetUniversityModalProps) {
  const [type, setType] = useState<'susi' | 'jeongsi'>(defaultType);
  const [susiCategory, setSusiCategory] = useState<SusiCategory>(defaultSusiCategory);
  const [jeongsiGroup, setJeongsiGroup] = useState<JeongsiGroup>(defaultJeongsiGroup);

  const [universityName, setUniversityName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [admissionType, setAdmissionType] = useState<'교과' | '종합' | '논술' | '수능위주'>('종합');

  // Susi fields
  const [expectedCutoffGrade, setExpectedCutoffGrade] = useState<number>(1.5);
  const [minCsatDesc, setMinCsatDesc] = useState<string>('수능최저 없음');
  const [requiredSubjectsCount, setRequiredSubjectsCount] = useState<number>(0);
  const [sumGradeLimit, setSumGradeLimit] = useState<number>(0);

  // Jeongsi fields
  const [percentileCutoff, setPercentileCutoff] = useState<number>(85.0);

  // 입결 DB 선택기 상태
  const [selectedUnivId, setSelectedUnivId] = useState<string>('inha');
  const [selectedDeptName, setSelectedDeptName] = useState<string>('');

  const currentUniv = useMemo(() => {
    return UNIVERSITY_ADMISSIONS_DB.find((u) => u.univId === selectedUnivId) || UNIVERSITY_ADMISSIONS_DB[0];
  }, [selectedUnivId]);

  const currentDept = useMemo(() => {
    return currentUniv?.departments.find((d) => d.deptName === selectedDeptName);
  }, [currentUniv, selectedDeptName]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      if (initialData.susiCategory) setSusiCategory(initialData.susiCategory);
      if (initialData.jeongsiGroup) setJeongsiGroup(initialData.jeongsiGroup);
      setUniversityName(initialData.universityName);
      setDepartmentName(initialData.departmentName);
      setAdmissionType(initialData.admissionType);

      if (initialData.susiRequirements) {
        setExpectedCutoffGrade(initialData.susiRequirements.expectedCutoffGrade ?? 1.5);
        setMinCsatDesc(initialData.susiRequirements.minimumCsatRequirement?.description ?? '수능최저 없음');
        setRequiredSubjectsCount(initialData.susiRequirements.minimumCsatRequirement?.requiredSubjectsCount ?? 0);
        setSumGradeLimit(initialData.susiRequirements.minimumCsatRequirement?.sumGradeLimit ?? 0);
      }
      if (initialData.jeongsiRequirements) {
        setPercentileCutoff(initialData.jeongsiRequirements.percentileCutoff ?? 85.0);
      }
    } else {
      setType(defaultType);
      setSusiCategory(defaultSusiCategory);
      setJeongsiGroup(defaultJeongsiGroup);
      setUniversityName('');
      setDepartmentName('');
      setAdmissionType(defaultType === 'susi' ? '종합' : '수능위주');
      setExpectedCutoffGrade(1.5);
      setMinCsatDesc('수능최저 없음');
      setRequiredSubjectsCount(0);
      setSumGradeLimit(0);
      setPercentileCutoff(85.0);
    }
  }, [initialData, defaultType, defaultSusiCategory, defaultJeongsiGroup, isOpen]);

  if (!isOpen) return null;

  // DB 학과 및 전형 원클릭 자동 적용 핸들러
  const applyDepartmentAdmission = (dept: DepartmentAdmissionData, trackType: 'gyogwa' | 'jonghap' | 'jeongsi') => {
    setUniversityName(currentUniv.univName);
    setDepartmentName(dept.deptName);

    if (trackType === 'gyogwa' && dept.susiGyogwa) {
      setType('susi');
      setAdmissionType('교과');
      setSusiCategory(dept.susiGyogwa.susiCategory);
      setExpectedCutoffGrade(dept.susiGyogwa.expectedCut5);
      setMinCsatDesc(dept.susiGyogwa.minCsatDesc);
      setRequiredSubjectsCount(dept.susiGyogwa.requiredSubjectsCount);
      setSumGradeLimit(dept.susiGyogwa.sumGradeLimit);
    } else if (trackType === 'jonghap' && dept.susiJonghap) {
      setType('susi');
      setAdmissionType('종합');
      setSusiCategory(dept.susiJonghap.susiCategory);
      setExpectedCutoffGrade(dept.susiJonghap.expectedCut5);
      setMinCsatDesc(dept.susiJonghap.minCsatDesc);
      setRequiredSubjectsCount(dept.susiJonghap.requiredSubjectsCount);
      setSumGradeLimit(dept.susiJonghap.sumGradeLimit);
    } else if (trackType === 'jeongsi' && dept.jeongsi) {
      setType('jeongsi');
      setAdmissionType('수능위주');
      setJeongsiGroup(dept.jeongsi.group);
      setPercentileCutoff(dept.jeongsi.percentileCut);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget: TargetUniversity = {
      id: initialData ? initialData.id : `univ-${Date.now()}`,
      type,
      susiCategory: type === 'susi' ? susiCategory : undefined,
      jeongsiGroup: type === 'jeongsi' ? jeongsiGroup : undefined,
      universityName: universityName.trim() || '목표 대학교',
      departmentName: departmentName.trim() || '목표 학과',
      admissionType,
      susiRequirements: type === 'susi' ? {
        subjectWeight: { 전교과: 1.0 },
        gradeWeight: { 1: 1.0, 2: 1.0, 3: 1.0 },
        expectedCutoffGrade: Number(expectedCutoffGrade),
        minimumCsatRequirement: {
          description: minCsatDesc.trim() || '수능최저 없음',
          requiredSubjectsCount: Number(requiredSubjectsCount),
          sumGradeLimit: Number(sumGradeLimit),
        },
      } : undefined,
      jeongsiRequirements: type === 'jeongsi' ? {
        percentileCutoff: Number(percentileCutoff),
        subjectWeights: { korean: 25, math: 35, inquiry: 30, english: 10, history: 0 },
      } : undefined,
    };

    onSave(newTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-navy p-4 sm:p-6 space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-navy/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coral/20 border-2 border-navy flex items-center justify-center text-navy shadow-retro">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-navy leading-tight">
                {initialData ? '목표 대학 수정' : '새 목표 대학 & 학과 추가'}
              </h3>
              <p className="text-[11px] text-navy-muted">
                입시요강 및 입결 DB에서 대학과 학과를 원클릭으로 불러올 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream border border-transparent hover:border-navy/30 text-navy/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. 입시요강 & 입결 DB 원클릭 스마트 검색/불러오기 영역 */}
        <div className="bg-cream/60 p-4 rounded-2xl border-2 border-navy space-y-3 shadow-retro">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-navy flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-coral" />
              <span>입시요강 입결 DB에서 빠른 선택</span>
            </label>
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-peach text-navy border border-navy/20">
              전체 학과 수록 DB 📚
            </span>
          </div>

          {/* 1단계: 대학 선택 */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-navy/70">1. 대학교 선택:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {UNIVERSITY_ADMISSIONS_DB.map((u) => (
                <button
                  key={u.univId}
                  type="button"
                  onClick={() => {
                    setSelectedUnivId(u.univId);
                    setSelectedDeptName(u.departments[0]?.deptName || '');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedUnivId === u.univId
                      ? 'bg-navy text-cream border-navy shadow-retro font-black'
                      : 'bg-white text-navy border-navy/25 hover:bg-peach/30'
                  }`}
                >
                  {u.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* 2단계: 학과(모집단위) 드롭다운 */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-navy/70">2. 모집단위 (학과) 선택 ({currentUniv.departments.length}개 학과):</span>
            <select
              value={selectedDeptName}
              onChange={(e) => setSelectedDeptName(e.target.value)}
              className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral shadow-retro-sm"
            >
              <option value="" disabled>원하는 학과를 선택하세요...</option>
              {currentUniv.departments.map((d) => (
                <option key={d.deptName} value={d.deptName}>
                  [{d.collegeName}] {d.deptName}
                </option>
              ))}
            </select>
          </div>

          {/* 3단계: 선택된 학과의 전형별 원클릭 적용 버튼 */}
          {currentDept && (
            <div className="pt-2 border-t border-navy/15 space-y-1.5 animate-fadeIn">
              <span className="text-[11px] font-black text-coral flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <span>3. 전형 클릭 시 아래 입력폼에 100% 자동 채워집니다:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 교과 버튼 */}
                {currentDept.susiGyogwa && (
                  <button
                    type="button"
                    onClick={() => applyDepartmentAdmission(currentDept, 'gyogwa')}
                    className="p-2 rounded-xl border-2 border-navy bg-white hover:bg-emerald-50 text-left transition-all hover:scale-[1.02] shadow-retro-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        수시 학생부교과
                      </span>
                      <span className="text-xs font-black text-navy">{currentDept.susiGyogwa.expectedCut5}등급</span>
                    </div>
                    <p className="text-[10px] text-navy/70 mt-1 truncate" title={currentDept.susiGyogwa.minCsatDesc}>
                      최저: {currentDept.susiGyogwa.minCsatDesc}
                    </p>
                  </button>
                )}

                {/* 종합 버튼 */}
                {currentDept.susiJonghap && (
                  <button
                    type="button"
                    onClick={() => applyDepartmentAdmission(currentDept, 'jonghap')}
                    className="p-2 rounded-xl border-2 border-navy bg-white hover:bg-sky-50 text-left transition-all hover:scale-[1.02] shadow-retro-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-sky-900 bg-sky-100 px-1.5 py-0.5 rounded">
                        수시 {currentDept.susiJonghap.typeName}
                      </span>
                      <span className="text-xs font-black text-navy">{currentDept.susiJonghap.expectedCut5}등급</span>
                    </div>
                    <p className="text-[10px] text-navy/70 mt-1 truncate">
                      {currentDept.susiJonghap.minCsatDesc}
                    </p>
                  </button>
                )}

                {/* 정시 버튼 */}
                {currentDept.jeongsi && (
                  <button
                    type="button"
                    onClick={() => applyDepartmentAdmission(currentDept, 'jeongsi')}
                    className="p-2 rounded-xl border-2 border-navy bg-white hover:bg-peach/50 text-left transition-all hover:scale-[1.02] shadow-retro-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-navy bg-peach px-1.5 py-0.5 rounded">
                        정시 {currentDept.jeongsi.group === 'ga' ? '가군' : currentDept.jeongsi.group === 'na' ? '나군' : '다군'}
                      </span>
                      <span className="text-xs font-black text-coral">{currentDept.jeongsi.percentileCut}%</span>
                    </div>
                    <p className="text-[10px] text-navy/70 mt-1 truncate">
                      수능 70% Cut 백분위
                    </p>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. 최종 세부 정보 입력 및 수정 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          
          {/* 수시 vs 정시 선택 탭 */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('susi')}
              className={`py-2 rounded-xl font-black border-2 border-navy transition-all ${
                type === 'susi' ? 'bg-navy text-cream shadow-retro' : 'bg-cream text-navy hover:bg-peach/30'
              }`}
            >
              수시 6장 포트폴리오
            </button>
            <button
              type="button"
              onClick={() => setType('jeongsi')}
              className={`py-2 rounded-xl font-black border-2 border-navy transition-all ${
                type === 'jeongsi' ? 'bg-navy text-cream shadow-retro' : 'bg-cream text-navy hover:bg-peach/30'
              }`}
            >
              정시 가/나/다군 포트폴리오
            </button>
          </div>

          {/* 소신/적정/안정 또는 군 선택 */}
          {type === 'susi' ? (
            <div>
              <label className="block text-[11px] font-black text-navy mb-1">수시 지원 분류</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'reach', label: '소신 / 상향' },
                  { key: 'target', label: '적정 지원' },
                  { key: 'safe', label: '안정 / 합격권' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSusiCategory(cat.key as SusiCategory)}
                    className={`py-1.5 rounded-xl text-xs font-bold border border-navy/30 transition-all ${
                      susiCategory === cat.key ? 'bg-coral text-navy font-black border-navy shadow-retro-sm' : 'bg-cream text-navy-muted hover:bg-peach/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-black text-navy mb-1">정시 모집 군</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'ga', label: '가군' },
                  { key: 'na', label: '나군' },
                  { key: 'da', label: '다군' },
                ].map((grp) => (
                  <button
                    key={grp.key}
                    type="button"
                    onClick={() => setJeongsiGroup(grp.key as JeongsiGroup)}
                    className={`py-1.5 rounded-xl text-xs font-bold border border-navy/30 transition-all ${
                      jeongsiGroup === grp.key ? 'bg-navy text-cream font-black border-navy shadow-retro-sm' : 'bg-cream text-navy-muted hover:bg-peach/30'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 대학명 & 학과명 직접 수정 가능 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-navy mb-1">대학교명</label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="예: 인하대학교"
                required
                className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 text-navy font-bold focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-navy mb-1">모집단위 (학과)</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="예: 수학교육과"
                required
                className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 text-navy font-bold focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
          </div>

          {/* 전형 유형 */}
          <div>
            <label className="block text-[11px] font-black text-navy mb-1">전형 유형</label>
            <div className="grid grid-cols-4 gap-2">
              {(['교과', '종합', '논술', '수능위주'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAdmissionType(t)}
                  className={`py-1.5 rounded-xl text-xs font-bold border border-navy/30 transition-all ${
                    admissionType === t ? 'bg-navy text-cream font-black border-navy shadow-retro-sm' : 'bg-cream text-navy-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 수시 전용 세부 입력값 */}
          {type === 'susi' && (
            <div className="bg-cream/40 p-3.5 rounded-2xl border-2 border-navy/20 space-y-3">
              <div>
                <label className="block text-[11px] font-black text-navy mb-1">
                  2028 5등급제 예상 합격선 (목표 등급)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={1.0}
                  max={5.0}
                  value={expectedCutoffGrade}
                  onChange={(e) => setExpectedCutoffGrade(Number(e.target.value))}
                  required
                  className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 font-black text-coral text-base"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-navy mb-1">
                  수능최저학력기준 설명
                </label>
                <input
                  type="text"
                  value={minCsatDesc}
                  onChange={(e) => setMinCsatDesc(e.target.value)}
                  placeholder="예: 국수영탐(1) 중 2개 영역 합 6 이내"
                  className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 text-navy font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-navy-muted mb-0.5">반영 영역 수 (개)</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={requiredSubjectsCount}
                    onChange={(e) => setRequiredSubjectsCount(Number(e.target.value))}
                    className="w-full bg-white border border-navy/30 rounded-lg px-2 py-1.5 text-center font-black text-navy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-muted mb-0.5">등급 합 한도 (이내)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={sumGradeLimit}
                    onChange={(e) => setSumGradeLimit(Number(e.target.value))}
                    className="w-full bg-white border border-navy/30 rounded-lg px-2 py-1.5 text-center font-black text-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 정시 전용 세부 입력값 */}
          {type === 'jeongsi' && (
            <div className="bg-cream/40 p-3.5 rounded-2xl border-2 border-navy/20 space-y-3">
              <div>
                <label className="block text-[11px] font-black text-navy mb-1">
                  정시 70% Cut 목표 백분위 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={percentileCutoff}
                  onChange={(e) => setPercentileCutoff(Number(e.target.value))}
                  required
                  className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 font-black text-coral text-base"
                />
              </div>
            </div>
          )}

          {/* 모달 액션 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-navy/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cream border border-navy/30 text-navy font-bold hover:bg-peach/30 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-navy text-cream font-black shadow-retro hover:bg-navy-light transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-coral" />
              <span>{initialData ? '수정 완료' : '목표 대학 저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
