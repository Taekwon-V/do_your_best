'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, ShieldAlert, LogIn, Lock, Users, Sparkles } from 'lucide-react';

export default function FamilyAccessGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loginWithGoogle, logout, allowedEmails } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [showTesterTools, setShowTesterTools] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-navy border-t-coral rounded-full animate-spin"></div>
          <p className="text-navy font-medium">가족 인증 시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 1. 비로그인 상태: 로그인 화면
  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-navy p-8 shadow-retro-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-coral/20 border-2 border-navy text-navy">
            <Lock className="w-8 h-8 text-navy" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-navy tracking-tight">
              2028 대입 전략 매니저
            </h1>
            <p className="text-sm text-navy-muted">
              자녀의 대입 성적 및 목표 전략 보호를 위해<br />
              <strong className="text-navy font-bold">지정된 가족의 Google 계정</strong>으로만 접근할 수 있습니다.
            </p>
          </div>

          {/* 원클릭 구글 로그인 버튼 */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => loginWithGoogle('family.manager@gmail.com', '가족 매니저')}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-coral hover:bg-coral-hover text-navy font-black rounded-2xl border-2 border-navy shadow-retro transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-5 h-5" />
              <span>가족 대표 Google 계정으로 로그인</span>
            </button>
          </div>

          {/* 인증 및 보안 안내 배지 */}
          <div className="p-4 bg-peach/30 rounded-2xl border border-navy/20 flex items-start gap-3 text-left">
            <ShieldCheck className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <div className="text-xs text-navy-muted leading-relaxed">
              <span className="font-bold text-navy">화이트리스트 보안 시스템 작동 중</span><br />
              부모님 및 자녀의 사전 등록된 계정 이외의 제3자 접근은 서버 및 클라이언트 레벨에서 엄격히 차단됩니다.
            </div>
          </div>

          {/* 테스트 계정 전환 도구 (토글) */}
          <div className="pt-2 border-t border-navy/10">
            <button
              onClick={() => setShowTesterTools(!showTesterTools)}
              className="text-xs text-navy-muted underline hover:text-navy"
            >
              {showTesterTools ? '▲ 테스트 도구 접기' : '▼ 다른 계정으로 로그인 시뮬레이션'}
            </button>

            {showTesterTools && (
              <div className="mt-3 p-3 bg-cream rounded-xl border border-navy/20 text-left space-y-2">
                <p className="text-xs font-bold text-navy">로그인 테스트 옵션:</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => loginWithGoogle('father@gmail.com', '아빠')}
                    className="text-xs text-left px-2.5 py-1.5 bg-white border border-navy rounded-lg hover:bg-sky-light text-navy"
                  >
                    👨 아빠 계정 (father@gmail.com) - [허용 ✅]
                  </button>
                  <button
                    onClick={() => loginWithGoogle('child1@gmail.com', '고2 첫째')}
                    className="text-xs text-left px-2.5 py-1.5 bg-white border border-navy rounded-lg hover:bg-sky-light text-navy"
                  >
                    🎓 첫째 계정 (child1@gmail.com) - [허용 ✅]
                  </button>
                  <button
                    onClick={() => loginWithGoogle('stranger@gmail.com', '외부인')}
                    className="text-xs text-left px-2.5 py-1.5 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 text-red-700"
                  >
                    ⛔ 비인가 외부인 (stranger@gmail.com) - [차단 테스트 ❌]
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. 비인가 계정 접근 시: 접근 차단 화면
  if (!user.isAllowedFamily) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-red-500 p-8 shadow-retro-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 border-2 border-red-500 text-red-600">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-600 tracking-tight">
              접근이 제한되었습니다
            </h2>
            <p className="text-sm text-navy-muted">
              로그인하신 계정(<span className="font-bold text-navy">{user.email}</span>)은<br />
              등록된 가족 구성원 명단에 존재하지 않습니다.
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 text-left leading-relaxed">
            본 서비스는 수험생 자녀의 개인정보 및 성적 보호를 위해 가족 전용 화이트리스트로 운영됩니다. 가족 계정으로 다시 로그인해 주세요.
          </div>

          <button
            onClick={logout}
            className="w-full py-3.5 px-4 bg-navy hover:bg-navy-dark text-cream font-bold rounded-2xl border-2 border-navy shadow-retro transition-all"
          >
            로그아웃 후 다른 계정으로 로그인
          </button>
        </div>
      </div>
    );
  }

  // 3. 인가된 가족: 정상 메인 대시보드 렌더링
  return <>{children}</>;
}
