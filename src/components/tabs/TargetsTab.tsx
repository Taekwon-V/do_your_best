'use client';

import React, { useState } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import Susi6CardGrid from '@/components/portfolio/Susi6CardGrid';
import Jeongsi3GunGrid from '@/components/portfolio/Jeongsi3GunGrid';
import RadarBalanceChart from '@/components/portfolio/RadarBalanceChart';
import WhatIfStrategyWidget from '@/components/portfolio/WhatIfStrategyWidget';
import TargetUniversityModal from '@/components/portfolio/TargetUniversityModal';
import { TargetUniversity, SusiCategory, JeongsiGroup } from '@/types/admissions';
import { Award, Plus, Sparkles } from 'lucide-react';

export default function TargetsTab() {
  const {
    activeChild,
    calculateCumulativeGPA,
    addTargetUniversity,
    updateTargetUniversity,
    deleteTargetUniversity,
  } = useAdmissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetUniversity | null>(null);
  const [modalDefaultType, setModalDefaultType] = useState<'susi' | 'jeongsi'>('susi');
  const [modalDefaultSusiCat, setModalDefaultSusiCat] = useState<SusiCategory>('target');
  const [modalDefaultJeongsiGroup, setModalDefaultJeongsiGroup] = useState<JeongsiGroup>('ga');

  const currentGPA = calculateCumulativeGPA(activeChild.courses || []);
  const mockExams = activeChild.mockExams || [];
  const latestMock = mockExams.length > 0
    ? [...mockExams].sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())[0]
    : null;

  const targetUniversities = activeChild.targetUniversities || [];

  const handleOpenAddSusi = (category: SusiCategory) => {
    setEditingTarget(null);
    setModalDefaultType('susi');
    setModalDefaultSusiCat(category);
    setIsModalOpen(true);
  };

  const handleOpenAddJeongsi = (group: JeongsiGroup) => {
    setEditingTarget(null);
    setModalDefaultType('jeongsi');
    setModalDefaultJeongsiGroup(group);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (target: TargetUniversity) => {
    setEditingTarget(target);
    setModalDefaultType(target.type);
    if (target.susiCategory) setModalDefaultSusiCat(target.susiCategory);
    if (target.jeongsiGroup) setModalDefaultJeongsiGroup(target.jeongsiGroup);
    setIsModalOpen(true);
  };

  const handleSaveTarget = (target: TargetUniversity) => {
    if (editingTarget) {
      updateTargetUniversity(activeChild.id, target);
    } else {
      addTargetUniversity(activeChild.id, target);
    }
  };

  const handleDeleteTarget = (targetId: string) => {
    if (confirm('해당 목표 대학 슬롯을 삭제하시겠습니까?')) {
      deleteTargetUniversity(activeChild.id, targetId);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Section Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-sm shrink-0">
            <Award className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-2xl font-black text-midnight tracking-tight leading-tight">
                목표 대학 포트폴리오 (수시 6장 + 정시 3군)
              </h2>
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-coral/20 text-coral">
                6+3 전략
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-midnight/70 mt-0.5">
              {activeChild.name}의 내신 및 수능최저 충족 여부를 진단하고 최적의 지원 전략을 수립합니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingTarget(null);
            setModalDefaultType('susi');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-2xl bg-coral text-white font-bold text-xs sm:text-sm hover:opacity-90 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>목표 대학 추가</span>
        </button>
      </div>

      {/* 2. Top Motivation & Analytics Grid: Radar Chart (Left) + What-If Strategy Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarBalanceChart
          courses={activeChild.courses || []}
          latestMock={latestMock}
          currentGPA={currentGPA}
        />
        <WhatIfStrategyWidget
          currentGPA={currentGPA}
          latestMock={latestMock}
          targetUniversities={targetUniversities}
          childName={activeChild.name}
        />
      </div>

      {/* 3. Susi 6-Card Golden Balance Grid (소신 2 / 적정 2 / 안정 2) */}
      <Susi6CardGrid
        targetUniversities={targetUniversities}
        currentGPA={currentGPA}
        latestMock={latestMock}
        onAddClick={handleOpenAddSusi}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleDeleteTarget}
      />

      {/* 4. Jeongsi 3-Gun Grid (가군 / 나군 / 다군) */}
      <Jeongsi3GunGrid
        targetUniversities={targetUniversities}
        latestMock={latestMock}
        onAddClick={handleOpenAddJeongsi}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleDeleteTarget}
      />

      {/* Target Modal */}
      <TargetUniversityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTarget}
        initialData={editingTarget}
        defaultType={modalDefaultType}
        defaultSusiCategory={modalDefaultSusiCat}
        defaultJeongsiGroup={modalDefaultJeongsiGroup}
      />
    </div>
  );
}
