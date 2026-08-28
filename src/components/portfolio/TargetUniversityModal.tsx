'use client';

import React, { useState, useEffect } from 'react';
import { TargetUniversity, SusiCategory, JeongsiGroup } from '@/types/admissions';
import { X, Sparkles, Building, BookOpen } from 'lucide-react';

interface PresetOption {
  univName: string;
  deptName: string;
  type: 'susi' | 'jeongsi';
  susiCategory?: SusiCategory;
  jeongsiGroup?: JeongsiGroup;
  admissionType: '교과' | '종합' | '논술' | '수능위주';
  expectedCut?: number;
  percentileCut?: number;
  minCsatDesc?: string;
  requiredSubjectsCount?: number;
  sumGradeLimit?: number;
}

const PRESETS: PresetOption[] = [
  // 인하대
  { univName: '인하대학교', deptName: '수학교육과 (지역균형)', type: 'susi', susiCategory: 'reach', admissionType: '교과', expectedCut: 1.33, minCsatDesc: '국수영탐 2개 영역 합 6 이내', requiredSubjectsCount: 2, sumGradeLimit: 6 },
  { univName: '인하대학교', deptName: '컴퓨터공학과 (인하미래인재)', type: 'susi', susiCategory: 'target', admissionType: '종합', expectedCut: 1.63, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0 },
  { univName: '인하대학교', deptName: '수학과 [교직이수] (인하미래인재)', type: 'susi', susiCategory: 'safe', admissionType: '종합', expectedCut: 1.91, minCsatDesc: '수능최저 없음 (교직과정 개설)', requiredSubjectsCount: 0, sumGradeLimit: 0 },
  { univName: '인하대학교', deptName: '컴퓨터공학과 (수능일반)', type: 'jeongsi', jeongsiGroup: 'ga', admissionType: '수능위주', percentileCut: 84.5 },

  // 인천대
  { univName: '국립인천대학교', deptName: '수학교육과 (교과우수자)', type: 'susi', susiCategory: 'target', admissionType: '교과', expectedCut: 1.48, minCsatDesc: '국수영탐 2개 영역 합 7 이내', requiredSubjectsCount: 2, sumGradeLimit: 7 },
  { univName: '국립인천대학교', deptName: '컴퓨터공학부 (자기추천)', type: 'susi', susiCategory: 'safe', admissionType: '종합', expectedCut: 1.86, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0 },
  { univName: '국립인천대학교', deptName: '수학교육과 (수능일반)', type: 'jeongsi', jeongsiGroup: 'na', admissionType: '수능위주', percentileCut: 80.3 },

  // 중앙대
  { univName: '중앙대학교', deptName: '소프트웨어학부 (CAU융합형인재)', type: 'susi', susiCategory: 'reach', admissionType: '종합', expectedCut: 1.28, minCsatDesc: '수능최저 없음 (서류+면접)', requiredSubjectsCount: 0, sumGradeLimit: 0 },
  { univName: '중앙대학교', deptName: '소프트웨어학부 (지역균형)', type: 'susi', susiCategory: 'reach', admissionType: '교과', expectedCut: 1.25, minCsatDesc: '국수영탐 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7 },
  { univName: '중앙대학교', deptName: '소프트웨어학부 (수능일반)', type: 'jeongsi', jeongsiGroup: 'da', admissionType: '수능위주', percentileCut: 91.5 },
];

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

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    if (isNaN(idx) || idx < 0 || idx >= PRESETS.length) return;
    const p = PRESETS[idx];

    setType(p.type);
    if (p.susiCategory) setSusiCategory(p.susiCategory);
    if (p.jeongsiGroup) setJeongsiGroup(p.jeongsiGroup);
    setUniversityName(p.univName);
    setDepartmentName(p.deptName);
    setAdmissionType(p.admissionType);

    if (p.expectedCut) setExpectedCutoffGrade(p.expectedCut);
    if (p.minCsatDesc) setMinCsatDesc(p.minCsatDesc);
    if (p.requiredSubjectsCount !== undefined) setRequiredSubjectsCount(p.requiredSubjectsCount);
    if (p.sumGradeLimit !== undefined) setSumGradeLimit(p.sumGradeLimit);
    if (p.percentileCut) setPercentileCutoff(p.percentileCut);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-peach/50 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-peach/30 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-midnight">
              {initialData ? '목표 대학 수정' : '새 목표 대학 & 학과 추가'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-peach/30 text-midnight/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Preset Picker */}
        <div className="mb-4 bg-cream/70 p-3 rounded-2xl border border-peach/40">
          <label className="block text-[11px] font-bold text-midnight mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            <span>주요 대학 입결 프리셋 불러오기</span>
          </label>
          <select
            onChange={handleSelectPreset}
            defaultValue=""
            className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-xs font-semibold text-midnight focus:outline-none focus:ring-2 focus:ring-coral"
          >
            <option value="" disabled>인하대/인천대/중앙대 대표 학과 선택...</option>
            {PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                [{p.type === 'susi' ? `수시 ${p.susiCategory}` : `정시 ${p.jeongsiGroup}`}] {p.univName} {p.deptName}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Susi vs Jeongsi Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('susi')}
              className={`py-2 rounded-xl font-bold transition-all ${
                type === 'susi' ? 'bg-midnight text-cream shadow-sm' : 'bg-cream text-midnight/70'
              }`}
            >
              수시 6장 포트폴리오
            </button>
            <button
              type="button"
              onClick={() => setType('jeongsi')}
              className={`py-2 rounded-xl font-bold transition-all ${
                type === 'jeongsi' ? 'bg-midnight text-cream shadow-sm' : 'bg-cream text-midnight/70'
              }`}
            >
              정시 가/나/다군 포트폴리오
            </button>
          </div>

          {/* Sub-Category Selector */}
          {type === 'susi' ? (
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">수시 지원 분류</label>
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
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      susiCategory === cat.key ? 'bg-coral text-white' : 'bg-peach/30 text-midnight/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">정시 모집 군</label>
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
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jeongsiGroup === grp.key ? 'bg-midnight text-cream' : 'bg-peach/30 text-midnight/70'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* University Name & Dept */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">대학교명</label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="예: 인하대학교"
                required
                className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-midnight mb-1">모집 단위(학과)</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="예: 수학교육과"
                required
                className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
          </div>

          {/* Admission Type */}
          <div>
            <label className="block text-[11px] font-bold text-midnight mb-1">전형 유형</label>
            <div className="grid grid-cols-4 gap-2">
              {(['교과', '종합', '논술', '수능위주'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAdmissionType(t)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    admissionType === t ? 'bg-navy text-cream' : 'bg-peach/30 text-midnight/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Susi Specific Fields */}
          {type === 'susi' && (
            <div className="bg-cream/40 p-3.5 rounded-2xl border border-peach/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-midnight mb-1">
                  2028 5등급제 예상 합격선 (등급)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={1.0}
                  max={5.0}
                  value={expectedCutoffGrade}
                  onChange={(e) => setExpectedCutoffGrade(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 font-bold text-midnight"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-midnight mb-1">
                  수능최저학력기준 설명
                </label>
                <input
                  type="text"
                  value={minCsatDesc}
                  onChange={(e) => setMinCsatDesc(e.target.value)}
                  placeholder="예: 국수영탐 중 2개 영역 합 6 이내"
                  className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 text-midnight"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-midnight/60 mb-0.5">반영 영역 수 (개)</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={requiredSubjectsCount}
                    onChange={(e) => setRequiredSubjectsCount(Number(e.target.value))}
                    className="w-full bg-white border border-peach/60 rounded-lg px-2 py-1.5 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-midnight/60 mb-0.5">등급 합 한도 (이내)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={sumGradeLimit}
                    onChange={(e) => setSumGradeLimit(Number(e.target.value))}
                    className="w-full bg-white border border-peach/60 rounded-lg px-2 py-1.5 text-center font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Jeongsi Specific Fields */}
          {type === 'jeongsi' && (
            <div className="bg-cream/40 p-3.5 rounded-2xl border border-peach/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-midnight mb-1">
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
                  className="w-full bg-white border border-peach/60 rounded-xl px-3 py-2 font-black text-coral text-base"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-peach/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-peach/30 text-midnight font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-coral text-white font-bold shadow-sm hover:opacity-90"
            >
              {initialData ? '수정 완료' : '목표 대학 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
