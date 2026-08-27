'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Compass } from 'lucide-react';

export default function InAppBrowserHandler() {
  const [isInApp, setIsInApp] = useState(false);
  const [isKakao, setIsKakao] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor || '';
    const isKakaoTalk = /KAKAOTALK/i.test(userAgent);
    const isOtherInApp = /Line|Instagram|FBAN|FBAV|Naver/i.test(userAgent);

    if (isKakaoTalk) {
      setIsKakao(true);
      setIsInApp(true);
      // 카카오톡 외부 브라우저 탈출 스킴 자동 실행
      const currentUrl = window.location.href;
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    } else if (isOtherInApp) {
      setIsInApp(true);
    }
  }, []);

  if (!isInApp) return null;

  const handleOpenExternal = () => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.href;
    if (isKakao) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    } else if (/android/i.test(navigator.userAgent)) {
      // 안드로이드 크롬 인텐트
      const cleanUrl = currentUrl.replace(/https?:\/\//i, '');
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('주소가 복사되었습니다. Safari 또는 Chrome 브라우저 주소창에 붙여넣어 주세요!');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-navy/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full bg-cream rounded-3xl border-2 border-navy p-6 shadow-retro-lg text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-coral border-2 border-navy flex items-center justify-center mx-auto shadow-retro">
          <Compass className="w-7 h-7 text-navy" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-navy tracking-tight">
            외부 기본 브라우저로 이동
          </h3>
          <p className="text-xs text-navy-muted leading-relaxed">
            카카오톡 인앱 브라우저에서는 <strong>구글 로그인 및 보안 정책</strong>상 정상 동작하지 않을 수 있습니다.
          </p>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-navy text-xs text-navy font-bold leading-relaxed text-left space-y-1">
          <p>👉 우측 상단 <strong>더보기(⋮ 또는 ⋯)</strong> 클릭</p>
          <p>👉 <strong className="text-coral underline font-black">"다른 브라우저로 열기"</strong> 선택</p>
        </div>

        <button
          onClick={handleOpenExternal}
          className="w-full py-3.5 px-4 bg-coral hover:bg-coral-hover text-navy font-black rounded-2xl border-2 border-navy shadow-retro flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>기본 브라우저(Safari / Chrome)로 열기</span>
        </button>
      </div>
    </div>
  );
}
