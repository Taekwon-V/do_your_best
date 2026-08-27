'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/admissions';
import { INITIAL_FAMILY_DATA } from '@/data/initialData';

interface AuthContextType {
  user: AuthUser | null;
  allowedEmails: string[];
  isLoading: boolean;
  loginWithGoogle: (email?: string, name?: string) => void;
  logout: () => void;
  addAllowedEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'admission_app_auth_user';
const ALLOWED_EMAILS_STORAGE_KEY = 'admission_app_allowed_emails';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [allowedEmails, setAllowedEmails] = useState<string[]>(INITIAL_FAMILY_DATA.allowedEmails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(ALLOWED_EMAILS_STORAGE_KEY);
      if (savedEmails) {
        setAllowedEmails(JSON.parse(savedEmails));
      }

      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // 기본값: 가족 대표 계정으로 자동 로그인된 상태로 시작 (편리한 초기 UX)
        const defaultUser: AuthUser = {
          id: 'user-family-1',
          name: '가족 매니저 (학부모)',
          email: 'family.manager@gmail.com',
          isAllowedFamily: true,
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = (email = 'family.manager@gmail.com', name = '가족 사용자') => {
    const isAllowed = allowedEmails.includes(email.trim().toLowerCase());
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name,
      email: email.trim().toLowerCase(),
      isAllowedFamily: isAllowed,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const addAllowedEmail = (email: string) => {
    const cleaned = email.trim().toLowerCase();
    if (cleaned && !allowedEmails.includes(cleaned)) {
      const updated = [...allowedEmails, cleaned];
      setAllowedEmails(updated);
      localStorage.setItem(ALLOWED_EMAILS_STORAGE_KEY, JSON.stringify(updated));
    }
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
