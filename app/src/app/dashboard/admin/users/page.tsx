'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MOCK_USERS } from '@/lib/mock-data';
import { UserProfile, UserRole } from '@/lib/types';
import { useAppState } from '@/lib/app-state';

export default function AdminUsersPage() {
  const { currentUser } = useAppState();
  const [usersList, setUsersList] = useState<UserProfile[]>(Object.values(MOCK_USERS));
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('mahasiswa');
  const [nim, setNim] = useState('');
  const [organization, setOrganization] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      full_name: fullName,
      email,
      role,
      nim: nim || undefined,
      organization: organization || undefined,
      created_at: new Date().toISOString(),
    };
    setUsersList([...usersList, newUser]);
    setModalOpen(false);
    setFullName('');
    setEmail('');
    setNim('');
    setOrganization('');
  };

  const roleBadges: Record<UserRole, string> = {
    mahasiswa: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    verifikator: 'bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    approver: 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    admin: 'bg-purple-50/60 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Kelola Pengguna Sistem SIPANDA
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Manajemen hak akses aktor (Mahasiswa, Verifikator Kemahasiswaan, Approver Wadek III, Admin)
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            + Tambah Pengguna
          </Button>
        </div>

        {currentUser.role !== 'admin' && (
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-400">
            Peran aktif saat ini: <strong>{currentUser.role}</strong>. Hak kelola penuh dimiliki oleh Administrator Sistem.
          </div>
        )}

        <Card title={`Daftar Akun Terdaftar (${usersList.length})`}>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                  <th className="py-2.5 px-3">Nama Lengkap & Identitas</th>
                  <th className="py-2.5 px-3">Email Akun</th>
                  <th className="py-2.5 px-3">Peran</th>
                  <th className="py-2.5 px-3">Unit / Lembaga</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {u.full_name}
                      </div>
                      {u.nim && (
                        <div className="text-[11px] font-mono text-zinc-400">
                          NIM: {u.nim}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500">
                      {u.email}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${roleBadges[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {u.organization || '-'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Add User */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Tambah Akun Pengguna Baru"
        >
          <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap:
              </label>
              <input
                type="text"
                required
                placeholder="Nama lengkap beserta gelar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email SSO / UB:
              </label>
              <input
                type="email"
                required
                placeholder="user@student.ub.ac.id atau @filkom.ub.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Peran Sistem:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="verifikator">Verifikator</option>
                  <option value="approver">Wadek III</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  NIM (Mahasiswa):
                </label>
                <input
                  type="text"
                  placeholder="2351504..."
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Organisasi / Unit:
              </label>
              <input
                type="text"
                placeholder="Contoh: BEM FILKOM / Departemen SI"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Simpan Akun
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
