'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppState } from '@/lib/app-state';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, switchRole } = useAppState();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Sidebar
        role={currentUser.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header
          currentUser={currentUser}
          onSwitchRole={switchRole}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
