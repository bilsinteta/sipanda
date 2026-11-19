'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppState } from '@/lib/app-state';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentUser, switchRole } = useAppState();

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsDesktopOpen((prev) => !prev);
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Sidebar
        role={currentUser.role}
        isMobileOpen={isMobileOpen}
        isDesktopOpen={isDesktopOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleDesktop={() => setIsDesktopOpen((prev) => !prev)}
      />
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
          isDesktopOpen ? 'lg:pl-64' : 'lg:pl-16'
        }`}
      >
        <Header
          currentUser={currentUser}
          isSidebarOpen={isDesktopOpen}
          onSwitchRole={switchRole}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

