'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar() {
  const { childrenList, activeChildId, switchChild } = useAdmissions();
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-cream border-b-2 border-navy sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 md:py-0 md:h-20 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4">
        
        {/* 상단 라인 (모바일에서는 로고 + 계정 정보, 데스크톱에서는 좌측 배치) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* 앱 로고 */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-coral border-2 border-navy flex items-center justify-center shadow-retro shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-navy" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-navy tracking-tight block leading-tight">
                2028 대입 전략
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-navy-muted tracking-wider uppercase block">
                Family Manager
              </span>
            </div>
          </div>

          {/* 모바일 전용 우측 계정 및 로그아웃 버튼 */}
          <div className="flex md:hidden items-center gap-2">
            <span className="text-[11px] font-black text-navy px-2 py-1 bg-white rounded-xl border border-navy shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>가족전용</span>
            </span>
            <button
              onClick={logout}
              title="로그아웃"
              className="p-2 rounded-xl bg-white hover:bg-red-50 text-navy hover:text-red-600 border border-navy shadow-sm active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. 중앙 자녀 프로필 스위처 (모바일/데스크톱 반응형 100% 최적화) */}
        <div className="w-full md:w-auto flex items-center justify-center">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-peach/50 p-1 sm:p-1.5 rounded-2xl sm:rounded-full border-2 border-navy shadow-retro gap-1">
            {childrenList.map((child) => {
              const isActive = child.id === activeChildId;
              return (
                <button
                  key={child.id}
                  onClick={() => switchChild(child.id)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-all duration-150 text-center ${
                    isActive
                      ? 'bg-coral text-navy border-2 border-navy shadow-retro'
                      : 'text-navy-muted hover:text-navy hover:bg-white/40 border-2 border-transparent'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-navy' : 'bg-navy/30'}`} />
                  <span className="truncate">{child.name}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({child.targetAdmissionYear} 대입)</span>
                  {isActive && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-white/80 rounded-full text-navy border border-navy/40 shrink-0 hidden xs:inline">
                      {child.currentGrade === 2 ? '고2' : '고1'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 데스크톱 우측 가족 전용 계정 정보 & 로그아웃 */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-2xl border-2 border-navy shadow-sm">
            <div className="w-7 h-7 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-xs">
              G
            </div>
            <div className="text-left leading-none">
              <div className="text-xs font-black text-navy flex items-center gap-1">
                <span>가족 전용 계정</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              </div>
              <span className="text-[10px] text-navy-muted truncate max-w-[120px] block mt-0.5">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="로그아웃"
            className="p-2.5 rounded-2xl bg-white hover:bg-red-50 text-navy hover:text-red-600 border-2 border-navy shadow-retro transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
