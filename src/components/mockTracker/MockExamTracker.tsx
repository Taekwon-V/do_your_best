'use client';

import React, { useState } from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import MockExamChart from './MockExamChart';
import JeongsiGapCard from './JeongsiGapCard';
import MockExamTable from './MockExamTable';
import MockExamModal from './MockExamModal';
import { MockExamRecord } from '@/types/admissions';
import { LineChart, Sparkles } from 'lucide-react';

export default function MockExamTracker() {
  const { activeChild, addMockExam, updateMockExam, deleteMockExam } = useAdmissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<MockExamRecord | null>(null);

  const [selectedTargetUniv, setSelectedTargetUniv] = useState({
    name: '인하대 수학교육과',
    percentile: 85.0,
  });

  const mockExams = activeChild.mockExams || [];

  const handleOpenAddModal = () => {
    setEditingExam(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exam: MockExamRecord) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleSaveExam = (exam: MockExamRecord) => {
    if (editingExam) {
      updateMockExam(activeChild.id, exam);
    } else {
      addMockExam(activeChild.id, exam);
    }
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('해당 모의고사 성적 기록을 삭제하시겠습니까?')) {
      deleteMockExam(activeChild.id, examId);
    }
  };

  const handleSelectTarget = (target: { univName: string; deptName: string; percentileCut: number }) => {
    setSelectedTargetUniv({
      name: `${target.univName} ${target.deptName}`,
      percentile: target.percentileCut,
    });
  };

  return (
    <section className="space-y-6">
      {/* Section Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-pastel-sky flex items-center justify-center text-midnight shadow-sm">
            <LineChart className="w-5 h-5 text-midnight" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight">
                [모듈 3] 2028 통합수능 모의고사 트래커 & 정시 Gap 분석
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-coral/20 text-coral">
                Phase 3 ⭐
              </span>
            </div>
            <p className="text-xs sm:text-sm text-midnight/70 mt-0.5">
              {activeChild.name}의 회차별 수능 백분위 성장 궤적과 목표 대학 정시 컷(Gap)을 실시간 분석합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Top 2-Column Grid: Left (Interactive Time-Series Chart) + Right (Jeongsi Gap Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Columns on large screens */}
        <div className="lg:col-span-2">
          <MockExamChart
            mockExams={mockExams}
            targetPercentile={selectedTargetUniv.percentile}
            targetUniversityName={selectedTargetUniv.name}
          />
        </div>

        {/* Right: 1 Column on large screens */}
        <div className="lg:col-span-1 flex flex-col">
          <JeongsiGapCard
            mockExams={mockExams}
            onSelectTarget={handleSelectTarget}
          />
        </div>
      </div>

      {/* Bottom: 2028 Integrated CSAT Mock Exam Gradebook Table */}
      <MockExamTable
        mockExams={mockExams}
        onAddClick={handleOpenAddModal}
        onEditClick={handleOpenEditModal}
        onDeleteClick={handleDeleteExam}
      />

      {/* Modal */}
      <MockExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExam}
        initialData={editingExam}
        currentGradeLevel={activeChild.currentGrade as 1 | 2 | 3}
      />
    </section>
  );
}
