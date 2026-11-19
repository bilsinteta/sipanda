'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import { MOCK_USERS } from '@/lib/mock-data';
import { setStoredUser } from '@/lib/app-state';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const foundUser =
        Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
        MOCK_USERS.mahasiswa;
      setStoredUser(foundUser);
      router.push('/dashboard');
    }, 350);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    const user = MOCK_USERS[role];
    setStoredUser(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              SP
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
              SIPANDA
            </span>
          </Link>
          <div className="flex justify-center mb-2">
            <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
          </div>
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Masuk ke Sistem
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gunakan akun SSO UB atau akses simulasi peran pengujian
          </p>
        </div>

        {/* Quick Demo 1-Click Role Login */}
        <div className="mb-4 p-3 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Simulasi Peran Pengujian (1-Klik)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">Demo</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => handleQuickRoleLogin('mahasiswa')}
              className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Mahasiswa</div>
              <div className="text-[10px] text-zinc-400 truncate">Fayyadh Radhwa</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('verifikator')}
              className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Verifikator</div>
              <div className="text-[10px] text-zinc-400 truncate">Staf Kemahasiswaan</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('approver')}
              className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Wakil Dekan III</div>
              <div className="text-[10px] text-zinc-400 truncate">Pemberi Persetujuan</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('admin')}
              className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Admin</div>
              <div className="text-[10px] text-zinc-400 truncate">Kelola Pengguna</div>
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <Card>
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Akun UB
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@student.ub.ac.id"
                className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="md">
              Masuk
            </Button>
          </form>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
