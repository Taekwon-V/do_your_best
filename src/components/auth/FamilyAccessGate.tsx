'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, ShieldAlert, LogIn, Lock, Plus, Check } from 'lucide-react';

export default function FamilyAccessGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loginWithGoogle, loginWithDemoAccount, logout, addAllowedEmail, allowedEmails } = useAuth();
  const [showTesterTools, setShowTesterTools] = useState(false);
  const [newFamilyEmail, setNewFamilyEmail] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-navy border-t-coral rounded-full animate-spin"></div>
          <p className="text-navy font-bold text-sm">가족 인증 시스템을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 1. 비로그인 상태: 로그인 화면 (실제 구글 팝업 로그인 지원)
  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-navy p-6 sm:p-8 shadow-retro-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-coral/20 border-2 border-navy text-navy">
            <Lock className="w-8 h-8 text-navy" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-navy tracking-tight">
              2028 대입 전략 매니저
            </h1>
            <p className="text-xs sm:text-sm text-navy-muted">
              자녀의 대입 성적 및 전략 보안을 위해<br />
              <strong className="text-navy font-bold">지정된 가족의 Google 계정</strong>으로만 로그인할 수 있습니다.
            </p>
          </div>

          {/* 실제 구글 팝업 로그인 버튼 */}
          <div className="space-y-3 pt-2">
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-coral hover:bg-coral-hover text-navy font-black rounded-2xl border-2 border-navy shadow-retro transition-all active:translate-x-0.5 active:translate-y-0.5 text-sm sm:text-base cursor-pointer"
            >
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google 계정으로 로그인</span>
            </button>
          </div>

          {/* 보안 안내 배지 */}
          <div className="p-3.5 bg-peach/30 rounded-2xl border border-navy/20 flex items-start gap-2.5 text-left">
            <ShieldCheck className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <div className="text-[11px] text-navy-muted leading-relaxed">
              <span className="font-bold text-navy">Firebase 실시간 보안 인증 작동 중</span><br />
              처음 로그인하신 구글 계정 및 사전 등록된 가족의 계정으로 즉시 대시보드가 활성화됩니다.
            </div>
          </div>

          {/* 데모/테스트 계정 전환 도구 (토글) */}
          <div className="pt-2 border-t border-navy/10">
            <button
              onClick={() => setShowTesterTools(!showTesterTools)}
              className="text-xs text-navy-muted underline hover:text-navy"
            >
              {showTesterTools ? '▲ 데모 도구 닫기' : '▼ 데모/테스트 계정으로 즉시 둘러보기'}
            </button>

            {showTesterTools && (
              <div className="mt-3 p-3 bg-cream rounded-xl border border-navy/20 text-left space-y-2">
                <p className="text-xs font-bold text-navy">간편 테스트 계정:</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => loginWithDemoAccount('family.manager@gmail.com', '가족 매니저')}
                    className="text-xs text-left px-2.5 py-1.5 bg-white border border-navy rounded-lg hover:bg-sky-light text-navy font-bold"
                  >
                    👨‍👩‍👧‍👦 가족 대표 데모 계정 (즉시 둘러보기)
                  </button>
                  <button
                    onClick={() => loginWithDemoAccount('stranger@gmail.com', '외부인')}
                    className="text-xs text-left px-2.5 py-1.5 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 text-red-700 font-bold"
                  >
                    ⛔ 비인가 외부인 차단 테스트 (stranger@gmail.com)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. 비인가 계정 접근 시: 접근 차단 화면 + 내 계정 가족으로 등록 버튼
  if (!user.isAllowedFamily) {
    const handleRegisterThisEmail = () => {
      addAllowedEmail(user.email);
      setAddedSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-red-500 p-6 sm:p-8 shadow-retro-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 border-2 border-red-500 text-red-600">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-600 tracking-tight">
              접근이 제한되었습니다
            </h2>
            <p className="text-xs sm:text-sm text-navy-muted">
              로그인하신 계정(<span className="font-bold text-navy">{user.email}</span>)은<br />
              아직 가족 화이트리스트에 등록되지 않았습니다.
            </p>
          </div>

          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 text-left leading-relaxed">
            본 서비스는 수험생 자녀의 개인정보 및 성적 보호를 위해 가족 전용 화이트리스트로 운영됩니다.
          </div>

          {/* 본인 계정 가족으로 즉시 승인 버튼 */}
          <div className="space-y-2">
            <button
              onClick={handleRegisterThisEmail}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl border border-emerald-800 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              {addedSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>내 계정({user.email})을 가족으로 승인하기</span>
            </button>
            
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-navy font-bold rounded-xl border border-navy text-xs"
            >
              로그아웃 후 다른 구글 계정으로 로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. 인가된 가족: 정상 메인 대시보드 렌더링
  return <>{children}</>;
}
