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
  loginWithDemoAccount: (email: string, name: string) => void;
  logout: () => Promise<void>;
  addAllowedEmail: (email: string) => void;
  removeAllowedEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_EMAILS_STORAGE_KEY = 'admission_app_allowed_emails';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [allowedEmails, setAllowedEmails] = useState<string[]>(INITIAL_FAMILY_DATA.allowedEmails);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 로컬 저장된 허용 이메일 목록 불러오기
  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
      if (savedEmails) {
        setAllowedEmails(JSON.parse(savedEmails));
      }
    } catch (e) {
      console.error('Failed to load allowed emails', e);
    }
  }, []);

  // 2. Firebase Auth 인증 상태 실시간 리스너
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const userEmail = firebaseUser.email.trim().toLowerCase();
        // 저장된 목록 또는 기본 목록 대조
        const currentAllowed = (() => {
          try {
            const saved = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
            return saved ? JSON.parse(saved) : allowedEmails;
          } catch {
            return allowedEmails;
          }
        })();

        const isAllowed = currentAllowed.some(
          (email: string) => email.trim().toLowerCase() === userEmail
        );

        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '가족 사용자',
          email: userEmail,
          avatarUrl: firebaseUser.photoURL || undefined,
          isAllowedFamily: isAllowed,
        });
      } else {
        // Firebase에 세션이 없으면 로컬 데모 세션 확인
        const demoSession = localStorage.getItem('admission_app_demo_user');
        if (demoSession) {
          try {
            setUser(JSON.parse(demoSession));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
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
      const isAllowed = allowedEmails.some(
        (e) => e.trim().toLowerCase() === email
      );

      // 만약 첫 로그인 사용자인 경우 자동으로 가족 화이트리스트에 첫 계정으로 등록 허용 지원
      let currentAllowed = [...allowedEmails];
      if (currentAllowed.length <= 5 && !currentAllowed.includes(email) && email) {
        currentAllowed.push(email);
        setAllowedEmails(currentAllowed);
        localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(currentAllowed));
      }

      setUser({
        id: result.user.uid,
        name: result.user.displayName || '가족 구성원',
        email: email,
        avatarUrl: result.user.photoURL || undefined,
        isAllowedFamily: isAllowed || currentAllowed.includes(email),
      });
      localStorage.removeItem('admission_app_demo_user');
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

  // 데모/테스트 계정 로그인
  const loginWithDemoAccount = (email: string, name: string) => {
    const isAllowed = allowedEmails.some(
      (e) => e.trim().toLowerCase() === email.trim().toLowerCase()
    );
    const demoUser: AuthUser = {
      id: `demo-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      isAllowedFamily: isAllowed,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };
    setUser(demoUser);
    localStorage.setItem('admission_app_demo_user', JSON.stringify(demoUser));
  };

  // 로그아웃
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Sign out error', e);
    }
    setUser(null);
    localStorage.removeItem('admission_app_demo_user');
  };

  // 허용 이메일 추가
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
        loginWithDemoAccount,
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
