'use client';

import React from 'react';
import FamilyAccessGate from '@/components/auth/FamilyAccessGate';
import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/dashboard/HeroBanner';
import OverviewGrid from '@/components/dashboard/OverviewGrid';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <FamilyAccessGate>
      <div className="min-h-screen bg-cream flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <HeroBanner />
            <OverviewGrid />
          </main>
        </div>
        <Footer />
      </div>
    </FamilyAccessGate>
  );
}
