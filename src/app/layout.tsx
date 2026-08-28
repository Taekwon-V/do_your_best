import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AdmissionsProvider } from '@/context/AdmissionsContext';
import InAppBrowserHandler from '@/components/common/InAppBrowserHandler';

export const metadata: Metadata = {
  title: '2028 대입 전략 매니저 - 고2/고1 가족 전용 입시 대시보드',
  description: '2028학년도 대입 개편안(내신 5등급제, 통합형 수능) 맞춤형 수시 역산 시뮬레이터 및 모의고사 트래커',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '2028 대입',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-cream text-navy selection:bg-coral selection:text-navy">
        <InAppBrowserHandler />
        <AuthProvider>
          <AdmissionsProvider>{children}</AdmissionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
