'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MOCK_USERS } from '@/lib/mock-data';
import { setStoredUser } from '@/lib/app-state';
import { UserRole } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'demo' | 'sso'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      // Try Supabase auth first if user was registered
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        // Logged in via real Supabase Auth
        const role = (data.user.user_metadata?.role as UserRole) || 'mahasiswa';
        setStoredUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role,
          nim: data.user.user_metadata?.nim,
          organization: data.user.user_metadata?.organization,
        });
        router.push('/dashboard');
        return;
      }
    } catch {
      // Supabase offline/mock fallback
    }

    // Fallback: Check local mock accounts or register session
    setTimeout(() => {
      const lowerEmail = email.toLowerCase().trim();
      const matched = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === lowerEmail
      );

      if (matched) {
        setStoredUser(matched);
      } else {
        // Any custom UB email logged in as student
        setStoredUser({
          id: `usr_${Date.now()}`,
          email,
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: 'mahasiswa',
          nim: '235150401111000',
          organization: 'Mahasiswa FILKOM UB',
        });
      }
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    const user = MOCK_USERS[role];
    setStoredUser(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

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
            Sistem Informasi Pengajuan Dana FILKOM UB
          </p>
        </div>

        {/* Tab Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-zinc-200/60 dark:bg-zinc-900 rounded-lg mb-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'demo'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Akses Demo 4 Aktor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sso')}
            className={`py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'sso'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Kredensial SSO / Email
          </button>
        </div>

        {activeTab === 'demo' ? (
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Pilih Peran Evaluasi (1-Klik)</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Instan</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => handleQuickRoleLogin('mahasiswa')}
                className="w-full p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">Mahasiswa / Ormawa</div>
                  <div className="text-[11px] text-zinc-400">Fayyadh Radhwa (NIM: 235150401111058)</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Ajukan Usulan →</span>
              </button>

              <button
                onClick={() => handleQuickRoleLogin('verifikator')}
                className="w-full p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">Verifikator Kemahasiswaan</div>
                  <div className="text-[11px] text-zinc-400">Ahmad Fauzi, S.Kom. (Staf Administrasi)</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Validasi Berkas →</span>
              </button>

              <button
                onClick={() => handleQuickRoleLogin('approver')}
                className="w-full p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">Wakil Dekan III FILKOM</div>
                  <div className="text-[11px] text-zinc-400">Dr. Eng. Ir. Hendra Gunawan, S.T., M.T.</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Persetujuan Dana →</span>
              </button>

              <button
                onClick={() => handleQuickRoleLogin('admin')}
                className="w-full p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-colors bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">Administrator Sistem</div>
                  <div className="text-[11px] text-zinc-400">Admin PSIK FILKOM UB</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Kelola Pengguna →</span>
              </button>
            </div>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleManualLogin} className="space-y-3">
              {message && (
                <div className="p-2 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Akun UB
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fayyadh@student.ub.ac.id"
                  className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
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
                  className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-[10px] text-zinc-500">
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">Akun Uji Coba Cepat:</p>
                <p>Mahasiswa: <span className="font-mono">fayyadh@student.ub.ac.id</span></p>
                <p>Verifikator: <span className="font-mono">verifikator@ub.ac.id</span></p>
                <p>Wadek III: <span className="font-mono">wadek3@ub.ac.id</span></p>
              </div>

              <Button type="submit" loading={loading} className="w-full" size="md">
                Masuk
              </Button>
            </form>
          </Card>
        )}

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
