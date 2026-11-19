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

  const roleColors: Record<UserRole, string> = {
    mahasiswa: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
    verifikator: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
    approver: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    admin: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Kelola Pengguna Sistem SIPANDA
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manajemen hak akses aktor (Mahasiswa, Verifikator Kemahasiswaan, Approver Wadek III, Admin)
            </p>
          </div>

          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Tambah Pengguna Baru
          </Button>
        </div>

        {currentUser.role !== 'admin' && (
          <div className="p-3.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300">
            ℹ️ Anda sedang melihat halaman ini dalam simulasi peran <strong>{currentUser.role}</strong>. Admin memiliki hak penuh mengelola akun dan wewenang approval.
          </div>
        )}

        <Card title={`Daftar Akun Terdaftar (${usersList.length})`}>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Nama Lengkap & Identitas</th>
                  <th className="py-3 px-3">Email Akun</th>
                  <th className="py-3 px-3">Peran / Hak Akses</th>
                  <th className="py-3 px-3">Unit / Ormawa</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {u.full_name}
                      </div>
                      {u.nim && (
                        <div className="text-[11px] font-mono text-slate-400">
                          NIM: {u.nim}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${roleColors[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {u.organization || '-'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
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
          <form onSubmit={handleAddUser} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Nama Lengkap:</label>
              <input
                type="text"
                required
                placeholder="Nama lengkap beserta gelar jika ada"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email UB / SSO:</label>
              <input
                type="email"
                required
                placeholder="user@student.ub.ac.id atau @filkom.ub.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Peran Sistem:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="mahasiswa">Mahasiswa / Ormawa</option>
                  <option value="verifikator">Verifikator Administrasi</option>
                  <option value="approver">Pemberi Persetujuan (Wadek III)</option>
                  <option value="admin">Administrator Sistem</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">NIM (Bagi Mahasiswa):</label>
                <input
                  type="text"
                  placeholder="2351504..."
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Organisasi / Unit Kerja:</label>
              <input
                type="text"
                placeholder="Contoh: BEM FILKOM / Departemen Sistem Informasi"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
