'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { useAuth } from '@/context/AuthContext';
import { MainTabKey } from '@/types/admissions';
import {
  GraduationCap,
  ShieldCheck,
  LogOut,
  Home,
  Target,
  TrendingUp,
  Award,
  FileText,
  CloudUpload,
  RefreshCw,
} from 'lucide-react';

interface TabItem {
  key: MainTabKey;
  label: string;
  icon: React.ElementType;
}

const DESKTOP_TABS: TabItem[] = [
  { key: 'home', label: '종합 홈', icon: Home },
  { key: 'susi', label: '수시 내신 & 역산', icon: Target },
  { key: 'jeongsi', label: '정시 모의고사 & Gap', icon: TrendingUp },
  { key: 'targets', label: '목표 대학 포트폴리오', icon: Award },
  { key: 'reports', label: '입결 DB & 리포트', icon: FileText },
];

export default function Navbar() {
  const {
    childrenList,
    activeChildId,
    switchChild,
    activeTab,
    setActiveTab,
    syncStatus,
    pushLocalToCloud,
  } = useAdmissions();
  const { user, logout } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleFullPush = async () => {
    setIsSyncing(true);
    try {
      const res = await pushLocalToCloud();
      alert(res.message);
    } catch (e: any) {
      alert('동기화 중 오류가 발생했습니다: ' + (e?.message || e));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="w-full bg-cream border-b-2 border-navy sticky top-0 z-50 shadow-sm">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 md:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4">
        {/* Logo & Mobile Account Info */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-coral border-2 border-navy flex items-center justify-center shadow-retro shrink-0">
              <GraduationCap className="w-5 h-5 text-navy" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black text-navy tracking-tight block leading-tight">
                2028 대입 전략
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-navy-muted tracking-wider uppercase block">
                Family Cloud Sync
              </span>
            </div>
          </div>

          {/* Mobile Right: Full Sync & Account & Logout */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={handleFullPush}
              disabled={isSyncing}
              className="p-1 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-[11px] border border-navy shadow-sm flex items-center gap-1 shrink-0 transition-all disabled:opacity-50"
              title="클라우드로 현재 데이터 전체 전송"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? '전송중...' : '전체동기화'}</span>
            </button>
            <span className="text-[10px] font-black text-navy px-1.5 py-1 bg-white rounded-xl border border-navy shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>가족</span>
            </span>
            <button
              onClick={logout}
              title="로그아웃"
              className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-navy hover:text-red-600 border border-navy shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Child Profile Switcher */}
        <div className="w-full md:w-auto flex items-center justify-center">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-peach/50 p-1 sm:p-1.5 rounded-2xl sm:rounded-full border-2 border-navy shadow-retro gap-1">
            {childrenList.map((child) => {
              const isActive = child.id === activeChildId;
              return (
                <button
                  key={child.id}
                  onClick={() => switchChild(child.id)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-all duration-150 text-center min-h-[38px] sm:min-h-[40px] ${
                    isActive
                      ? 'bg-coral text-navy border-2 border-navy shadow-retro'
                      : 'text-navy-muted hover:text-navy hover:bg-white/40 border-2 border-transparent'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-navy' : 'bg-navy/30'}`} />
                  <span className="truncate max-w-[80px] sm:max-w-none">{child.name}</span>
                  <span className="text-[10px] font-bold opacity-80 shrink-0">
                    ({child.currentGrade === 2 ? '고2' : '고1'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Right: Full Sync Button & Account Info & Logout */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={handleFullPush}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:translate-x-0.5 active:translate-y-0.5 text-white rounded-2xl border-2 border-navy shadow-retro font-black text-xs transition-all disabled:opacity-50"
            title="현재 내 화면의 모든 데이터(수시 6장 포트폴리오, 성적 등)를 클라우드로 전송합니다."
          >
            <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? '클라우드 전송 중...' : '⚡ 데이터 전체 동기화'}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-2xl border-2 border-navy shadow-sm">
            <div className="w-6 h-6 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-xs">
              G
            </div>
            <div className="text-left leading-none">
              <div className="text-xs font-black text-navy flex items-center gap-1">
                <span>가족 공용 DB</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              </div>
              <span className="text-[10px] text-navy-muted truncate max-w-[110px] block mt-0.5">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="로그아웃"
            className="p-2 rounded-2xl bg-white hover:bg-red-50 text-navy hover:text-red-600 border-2 border-navy shadow-retro transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs Bar */}
      <div className="hidden md:block bg-white/60 border-t border-peach/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 py-1.5 overflow-x-auto">
          {DESKTOP_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  isActive
                    ? 'bg-navy text-cream shadow-sm scale-105'
                    : 'text-navy/70 hover:bg-peach/30 hover:text-navy'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-coral' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
