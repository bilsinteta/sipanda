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
      // Find matching mock user or default to mahasiswa
      const foundUser =
        Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
        MOCK_USERS.mahasiswa;
      setStoredUser(foundUser);
      router.push('/dashboard');
    }, 400);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    const user = MOCK_USERS[role];
    setStoredUser(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-sm">
              🐼
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SIPANDA
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  UB
                </span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fakultas Ilmu Komputer Universitas Brawijaya
              </p>
            </div>
          </Link>
          <div className="flex justify-center mb-2">
            <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Masuk ke Akun SIPANDA
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan akun SSO UB atau pilih simulasi peran cepat di bawah
          </p>
        </div>

        {/* Quick Demo 1-Click Role Login Card */}
        <div className="mb-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>⚡ Masuk Cepat Simulasi (1-Klik)</span>
            <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-200">
              Demo Pengujian
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickRoleLogin('mahasiswa')}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-left transition-all hover:shadow-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">👨‍🎓 Mahasiswa</div>
              <div className="text-[10px] text-slate-500 line-clamp-1">Fayyadh (NIM: 235150401111058)</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('verifikator')}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-amber-500 text-left transition-all hover:shadow-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">📋 Verifikator</div>
              <div className="text-[10px] text-slate-500 line-clamp-1">Staf Kemahasiswaan</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('approver')}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-left transition-all hover:shadow-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">⚖️ Approver</div>
              <div className="text-[10px] text-slate-500 line-clamp-1">Wakil Dekan III FILKOM</div>
            </button>
            <button
              onClick={() => handleQuickRoleLogin('admin')}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-purple-500 text-left transition-all hover:shadow-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">⚙️ Admin Sistem</div>
              <div className="text-[10px] text-slate-500 line-clamp-1">Kelola Pengguna & Audit</div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <Card className="shadow-md">
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Alamat Email / Akun UB
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@student.ub.ac.id"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <span className="text-emerald-600 hover:underline cursor-pointer">Lupa kata sandi?</span>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Masuk dengan Kredensial
            </Button>
          </form>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 underline">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

