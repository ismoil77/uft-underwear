'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { teamAPI } from '@/lib/api';
import { TeamMember } from '@/types/api';
import { ChevronLeft, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminUsersPage from '../users/page'

export default function AdminTeamPage() {
  const t = useTranslations('adminTeam');

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember & { password?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    teamAPI.getAll().then(setMembers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing };
      if (editing.password) payload.password = editing.password; // добавляем пароль
      if (editing.id) {
        const updated = await teamAPI.update(editing.id, payload);
        setMembers(members.map((m) => (m.id === editing.id ? updated : m)));
      } else {
        const created = await teamAPI.create(payload);
        setMembers([...members, created]);
      }
      setEditing(null);
    } catch (e) {
      alert(t('alerts.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('alerts.deleteConfirm'))) return;
    try {
      await teamAPI.delete(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (e) {
      alert(t('alerts.deleteError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <AdminUsersPage/> */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() =>
              setEditing({ name: '', role: '', password: '', image: '', description: '' })
            }
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" /> {t('buttons.add')}
          </button>
        </div>

        {/* Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editing.id ? t('headers.editing') : t('headers.new')}
                </h2>
                <button onClick={() => setEditing(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('fields.name')}
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder={t('fields.password')}
                  value={editing.password || ''}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="url"
                  placeholder={t('fields.image')}
                  value={editing.image || ''}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder={t('fields.description')}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />

                <button
                  onClick={handleSave}
                  disabled={saving || !editing.name || !editing.password} // теперь только имя и пароль
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {t('buttons.save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : members.length > 0 ? (
            <div className="divide-y">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                  </div>
                  <button
                    onClick={() => setEditing(member)}
                    className="p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id!)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">{t('alerts.noMembers')}</div>
          )}
        </div>
      </main>
    </div>
  );
}
