'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/admissions';
import { INITIAL_FAMILY_DATA } from '@/data/initialData';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: AuthUser | null;
  allowedEmails: string[];
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addAllowedEmail: (email: string) => void;
  removeAllowedEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_EMAILS_STORAGE_KEY = 'admission_app_allowed_emails';

// Gmail 점(dot) 무시 및 도메인 정규화 헬퍼 함수
function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return trimmed;
  const [localPart, domain] = parts;
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `${localPart.replace(/\./g, '')}@gmail.com`;
  }
  return trimmed;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [allowedEmails, setAllowedEmails] = useState<string[]>(INITIAL_FAMILY_DATA.allowedEmails);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 로컬 저장된 허용 이메일 목록 불러오기 & 최신 목록과 병합
  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
      if (savedEmails) {
        const parsed: string[] = JSON.parse(savedEmails);
        // 최신 초기 목록과 합쳐서 누락 방지
        const merged = Array.from(new Set([...INITIAL_FAMILY_DATA.allowedEmails, ...parsed]));
        setAllowedEmails(merged);
        localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(merged));
      } else {
        localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(INITIAL_FAMILY_DATA.allowedEmails));
      }
    } catch (e) {
      console.error('Failed to load allowed emails', e);
    }
  }, []);

  // 2. Firebase Auth 인증 상태 실시간 리스너 (철저한 화이트리스트 대조 + Gmail 점 정규화)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const userEmail = firebaseUser.email.trim().toLowerCase();
        
        const currentAllowed = (() => {
          try {
            const saved = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
            const list: string[] = saved ? JSON.parse(saved) : allowedEmails;
            return Array.from(new Set([...INITIAL_FAMILY_DATA.allowedEmails, ...list]));
          } catch {
            return INITIAL_FAMILY_DATA.allowedEmails;
          }
        })();

        // 엄격한 화이트리스트 검사 (Gmail 점 무시 정규화 적용)
        const isAllowed = currentAllowed.some(
          (email: string) => normalizeEmail(email) === normalizeEmail(userEmail)
        );

        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '가족 사용자',
          email: userEmail,
          avatarUrl: firebaseUser.photoURL || undefined,
          isAllowedFamily: isAllowed,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [allowedEmails]);

  // 실제 Firebase Google 팝업 로그인
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.trim().toLowerCase() || '';
      
      const currentAllowed = (() => {
        try {
          const saved = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
          const list: string[] = saved ? JSON.parse(saved) : allowedEmails;
          return Array.from(new Set([...INITIAL_FAMILY_DATA.allowedEmails, ...list]));
        } catch {
          return INITIAL_FAMILY_DATA.allowedEmails;
        }
      })();

      // 철저한 화이트리스트 검증 (Gmail 점 무시 정규화 적용)
      const isAllowed = currentAllowed.some(
        (e: string) => normalizeEmail(e) === normalizeEmail(email)
      );

      setUser({
        id: result.user.uid,
        name: result.user.displayName || '가족 구성원',
        email: email,
        avatarUrl: result.user.photoURL || undefined,
        isAllowedFamily: isAllowed,
      });
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('팝업 차단이 감지되었습니다. 브라우저 팝업 허용 후 다시 시도해 주세요.');
      } else if (error.code !== 'auth/popup-closed-by-user') {
        alert(`구글 로그인 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Sign out error', e);
    }
    setUser(null);
  };

  // 허용 이메일 추가 (관리자 기능)
  const addAllowedEmail = (email: string) => {
    const cleaned = email.trim().toLowerCase();
    if (cleaned && !allowedEmails.includes(cleaned)) {
      const updated = [...allowedEmails, cleaned];
      setAllowedEmails(updated);
      localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // 허용 이메일 제거
  const removeAllowedEmail = (email: string) => {
    const updated = allowedEmails.filter((e) => e !== email.trim().toLowerCase());
    setAllowedEmails(updated);
    localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allowedEmails,
        isLoading,
        loginWithGoogle,
        logout,
        addAllowedEmail,
        removeAllowedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
