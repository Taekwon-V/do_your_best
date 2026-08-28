'use client';

import React from 'react';
import GoalSeekSimulator from '@/components/simulator/GoalSeekSimulator';
import GradebookTable from '@/components/simulator/GradebookTable';

export default function SusiTab() {
  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      <GoalSeekSimulator />
      <GradebookTable />
    </div>
  );
}
