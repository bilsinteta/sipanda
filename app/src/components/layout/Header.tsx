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
    // Check initial dark mode preference
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
    mahasiswa: { label: 'Mahasiswa / Ormawa', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    verifikator: { label: 'Verifikator Administrasi', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    approver: { label: 'Pemberi Persetujuan (Wadek III)', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    admin: { label: 'Administrator Sistem', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile hamburger & breadcrumb/title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            FILKOM UB
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Sistem Informasi Pengajuan Dana
          </span>
        </div>
      </div>

      {/* Middle: Carbon Badge */}
      <div className="hidden md:block">
        <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
      </div>

      {/* Right: Role Switcher, Dark mode, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for seamless demo/testing */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Ganti Peran Pengguna untuk Pengujian Demo"
          >
            <span className="hidden sm:inline text-slate-400">Peran:</span>
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${roleLabels[currentUser.role].badge}`}>
              {currentUser.role}
            </span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 text-xs"
              onClick={() => setRoleMenuOpen(false)}
            >
              <div className="px-2 py-1.5 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                Simulasi Peran Aktor
              </div>
              {(['mahasiswa', 'verifikator', 'approver', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    currentUser.role === r
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {currentUser.role === r && (
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap (Hemat Energi OLED)'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User profile avatar & logout */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
              {currentUser.full_name}
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-1">
              {currentUser.nim || currentUser.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            title="Keluar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
