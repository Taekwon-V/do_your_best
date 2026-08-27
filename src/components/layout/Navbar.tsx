'use client';

import React from 'react';
import { useAdmissions } from '@/context/AdmissionsContext';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { childrenList, activeChildId, switchChild } = useAdmissions();
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-cream border-b-2 border-navy sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. 앱 로고 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-coral border-2 border-navy flex items-center justify-center shadow-retro">
            <GraduationCap className="w-6 h-6 text-navy" />
          </div>
          <div>
            <span className="text-xl font-black text-navy tracking-tight block leading-tight">
              2028 대입 전략
            </span>
            <span className="text-xs font-bold text-navy-muted tracking-wider uppercase">
              Family Manager
            </span>
          </div>
        </div>

        {/* 2. 중앙 자녀 프로필 스위처 (Happy Hues 17 Style Capsule Switcher) */}
        <div className="flex items-center bg-peach/40 p-1.5 rounded-full border-2 border-navy shadow-retro">
          {childrenList.map((child) => {
            const isActive = child.id === activeChildId;
            return (
              <button
                key={child.id}
                onClick={() => switchChild(child.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-black text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-coral text-navy border-2 border-navy shadow-retro'
                    : 'text-navy-muted hover:text-navy hover:bg-white/40 border-2 border-transparent'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-navy' : 'bg-navy/30'}`} />
                <span>{child.name} ({child.targetAdmissionYear} 대입)</span>
                {isActive && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-white/70 rounded-full text-navy border border-navy/40">
                    {child.currentGrade === 2 ? '고2·남은2학기' : '고1·남은4학기'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. 우측 가족 전용 계정 정보 & 로그아웃 */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 구글 계정 & 가족 인증 배지 */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-2xl border-2 border-navy shadow-sm">
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

          {/* 로그아웃 버튼 */}
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
