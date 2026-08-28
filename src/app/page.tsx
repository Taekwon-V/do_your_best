'use client';

import React from 'react';
import FamilyAccessGate from '@/components/auth/FamilyAccessGate';
import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/dashboard/HeroBanner';
import GoalSeekSimulator from '@/components/simulator/GoalSeekSimulator';
import GradebookTable from '@/components/simulator/GradebookTable';
import MockExamTracker from '@/components/mockTracker/MockExamTracker';
import OverviewGrid from '@/components/dashboard/OverviewGrid';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <FamilyAccessGate>
      <div className="min-h-screen bg-cream flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
            <HeroBanner />
            <GoalSeekSimulator />
            <GradebookTable />
            <MockExamTracker />
            <OverviewGrid />
          </main>
        </div>
        <Footer />
      </div>
    </FamilyAccessGate>
  );
}
