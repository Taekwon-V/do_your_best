'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { RotateCcw, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { resetToInitialData } = useAdmissions();

  const handleReset = () => {
    if (window.confirm('기본 샘플 데이터로 초기화하시겠습니까? (현재 변경사항이 리셋됩니다)')) {
      resetToInitialData();
      alert('초기 데이터로 리셋되었습니다.');
    }
  };

  return (
    <footer className="w-full bg-cream border-t-2 border-navy py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-navy">2028 대입 전략 매니저 (가족 전용)</span>
          <span>• 2028/2029 개편안 5등급제 & 통합수능 지원</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-navy-muted hover:text-navy underline hover:no-underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>샘플 데이터 초기화</span>
          </button>
          <span>Happy Hues #17 Palette Applied</span>
        </div>
      </div>
    </footer>
  );
}
