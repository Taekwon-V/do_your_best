'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { MainTabKey } from '@/types/admissions';
import { Home, Target, TrendingUp, GraduationCap, FileText } from 'lucide-react';

interface TabItem {
  key: MainTabKey;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { key: 'home', label: '종합 홈', icon: Home },
  { key: 'susi', label: '수시 내신', icon: Target },
  { key: 'jeongsi', label: '정시 모평', icon: TrendingUp },
  { key: 'targets', label: '목표 대학', icon: GraduationCap },
  { key: 'reports', label: '입결 리포트', icon: FileText },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAdmissions();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-navy px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 relative ${
                isActive
                  ? 'text-navy font-black scale-105'
                  : 'text-navy-muted/70 font-semibold hover:text-navy'
              }`}
            >
              {/* Active Background Pill Indicator */}
              {isActive && (
                <span className="absolute inset-0 bg-coral/25 rounded-xl -z-10 animate-scaleIn" />
              )}

              <Icon
                className={`w-5 h-5 mb-0.5 transition-transform ${
                  isActive ? 'text-coral scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
