'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserProfile, UserRole } from '@/lib/types';
import { CarbonBadge } from '../ui/CarbonBadge';

interface HeaderProps {
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onToggleSidebar,
}) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    mahasiswa: { label: 'Mahasiswa / Ormawa', badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' },
    verifikator: { label: 'Verifikator Administrasi', badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' },
    approver: { label: 'Pemberi Persetujuan (Wadek III)', badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' },
    admin: { label: 'Administrator Sistem', badge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300' },
  };

  return (
    <header className="h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Buka menu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            FILKOM UB
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            SIPANDA
          </span>
        </div>
      </div>

      {/* Middle: Carbon badge */}
      <div className="hidden md:block">
        <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <span className="text-zinc-400 text-[11px]">Peran:</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">
              {currentUser.role}
            </span>
            <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-1.5 z-50 text-xs"
              onClick={() => setRoleMenuOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Ganti Peran Aktor
              </div>
              {(['mahasiswa', 'verifikator', 'approver', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                    currentUser.role === r
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {currentUser.role === r && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap (OLED Eco)'}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User initials & logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-6 h-6 rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-semibold flex items-center justify-center text-[10px]">
            {currentUser.full_name.charAt(0)}
          </div>
          <span className="hidden lg:inline text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {currentUser.full_name.split(' ')[0]}
          </span>
          <button
            onClick={handleLogout}
            className="p-1 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-0.5"
            title="Keluar"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
