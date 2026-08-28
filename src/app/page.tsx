'use client';

import React from 'react';
import FamilyAccessGate from '@/components/auth/FamilyAccessGate';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { useAdmissions } from '@/context/AdmissionsContext';

// 5 Main Focused Tab Views
import HomeTab from '@/components/tabs/HomeTab';
import SusiTab from '@/components/tabs/SusiTab';
import JeongsiTab from '@/components/tabs/JeongsiTab';
import TargetsTab from '@/components/tabs/TargetsTab';
import ReportsTab from '@/components/tabs/ReportsTab';

function TabRouter() {
  const { activeTab } = useAdmissions();

  switch (activeTab) {
    case 'home':
      return <HomeTab />;
    case 'susi':
      return <SusiTab />;
    case 'jeongsi':
      return <JeongsiTab />;
    case 'targets':
      return <TargetsTab />;
    case 'reports':
      return <ReportsTab />;
    default:
      return <HomeTab />;
  }
}

export default function Home() {
  return (
    <FamilyAccessGate>
      <div className="min-h-screen bg-cream flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
            <TabRouter />
          </main>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </FamilyAccessGate>
  );
}
