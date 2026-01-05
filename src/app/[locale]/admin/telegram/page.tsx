'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // Добавлен хук перевода
import { Link } from '@/i18n/navigation';
import { telegramSettingsAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2, Plus, Trash2, Bot, Users, Bell, CheckCircle, XCircle, TestTube, RefreshCw } from 'lucide-react';
import { TelegramChat, TelegramSettings, TelegramUpdate } from '@/types/api';

export default function AdminTelegramPage() {
  const t = useTranslations('adminTelegram'); // Инициализация переводов
  
  const [settings, setSettings] = useState<TelegramSettings>({
    botToken: '',
    botUsername: '',
    isActive: false,
    chats: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ chatId: string; success: boolean; message: string } | null>(null);
  const [newChat, setNewChat] = useState({
    chatId: '',
    threadId: '',
    name: '',
    type: 'personal' as TelegramChat['type'],
  });
  const [showAddChat, setShowAddChat] = useState(false);
  const [updates, setUpdates] = useState<TelegramUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  const loadUpdates = async () => {
    setLoadingUpdates(true);
    try {
      const res = await fetch('/api/telegram/updates');
      const data = await res.json();
      setUpdates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUpdates(false);
    }
  };

  useEffect(() => {
    loadUpdates();
    telegramSettingsAPI.get()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await telegramSettingsAPI.update(settings.id, settings);
      } else {
        const created = await telegramSettingsAPI.create(settings);
        setSettings(created);
      }
      alert(t('messages.saveSuccess'));
    } catch (e) {
      alert(t('messages.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddChat = () => {
    if (!newChat.chatId || !newChat.name) return;

    const chat: TelegramChat = {
      id: Date.now().toString(),
      chatId: newChat.chatId,
      threadId: newChat.threadId || undefined,
      name: newChat.name,
      type: newChat.threadId ? 'thread' : newChat.type,
      notifications: {
        newOrder: true,
        statusChange: true,
        lowStock: false,
      },
      isActive: true,
    };

    setSettings({
      ...settings,
      chats: [...settings.chats, chat],
    });

    setNewChat({ chatId: '', threadId: '', name: '', type: 'personal' });
    setShowAddChat(false);
  };

  const handleRemoveChat = (chatId: string) => {
    if (!confirm(t('recipients.deleteConfirm'))) return;
    setSettings({ ...settings, chats: settings.chats.filter((c) => c.id !== chatId) });
  };

  const handleToggleChatNotification = (chatId: string, notificationType: keyof TelegramChat['notifications']) => {
    setSettings({
      ...settings,
      chats: settings.chats.map((c) =>
        c.id === chatId
          ? { ...c, notifications: { ...c.notifications, [notificationType]: !c.notifications[notificationType] } }
          : c
      ),
    });
  };

  const handleToggleChatActive = (chatId: string) => {
    setSettings({
      ...settings,
      chats: settings.chats.map((c) => (c.id === chatId ? { ...c, isActive: !c.isActive } : c)),
    });
  };

  const handleTestMessage = async (chat: TelegramChat) => {
    if (!settings.botToken) {
      alert(t('messages.tokenRequired'));
      return;
    }
    
    setTesting(chat.id);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: settings.botToken,
          chatId: chat.chatId,
          name: chat.name,
        }),
      });
      
      const result = await response.json();
      setTestResult({ chatId: chat.id, success: result.success, message: result.message });
    } catch (e) {
      setTestResult({ chatId: chat.id, success: false, message: t('messages.testError') });
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Bot className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Инструкция */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-blue-900 mb-2">{t('setup.title')}</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>{t('setup.step1')}</li>
            <li>{t('setup.step2')}</li>
            <li>{t('setup.step3')}</li>
            <li>{t('setup.step4')}</li>
          </ol>
        </div>

        {/* Настройки бота */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-400" /> {t('botSettings.title')}
            </h2>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{t('botSettings.active')}</span>
              <div
                onClick={() => setSettings({ ...settings, isActive: !settings.isActive })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.isActive ? 'translate-x-5.5' : 'translate-x-0.5 shadow-sm'}`}></div>
              </div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('botSettings.token')}</label>
              <input
                type="password"
                placeholder={t('botSettings.tokenPlaceholder')}
                value={settings.botToken}
                onChange={(e) => setSettings({ ...settings, botToken: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">{t('botSettings.tokenHint')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('botSettings.username')}</label>
              <input
                type="text"
                placeholder={t('botSettings.usernamePlaceholder')}
                value={settings.botUsername || ''}
                onChange={(e) => setSettings({ ...settings, botUsername: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Получатели */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" /> {t('recipients.title')}
            </h2>
            <button
              onClick={() => setShowAddChat(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" /> {t('recipients.add')}
            </button>
          </div>

          {showAddChat && (
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-semibold text-gray-800 mb-4">{t('recipients.newTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t('recipients.chatId')}
                  value={newChat.chatId}
                  onChange={(e) => setNewChat({ ...newChat, chatId: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder={t('recipients.threadId')}
                  value={newChat.threadId}
                  onChange={(e) => setNewChat({ ...newChat, threadId: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder={t('recipients.name')}
                  value={newChat.name}
                  onChange={(e) => setNewChat({ ...newChat, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <select
                  value={newChat.type}
                  onChange={(e) => setNewChat({ ...newChat, type: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  <option value="personal">{t('recipients.types.personal')}</option>
                  <option value="group">{t('recipients.types.group')}</option>
                  <option value="channel">{t('recipients.types.channel')}</option>
                  <option value="thread">{t('recipients.types.thread')}</option>
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleAddChat} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold shadow-sm transition-all">
                  {t('recipients.add')}
                </button>
                <button onClick={() => setShowAddChat(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all">
                  {t('recipients.cancel')}
                </button>
              </div>
            </div>
          )}

          {settings.chats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {settings.chats.map((chat) => (
                <div key={chat.id} className={`group border rounded-xl p-5 transition-all ${chat.isActive ? 'border-green-100 bg-green-50/20' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
                        {chat.type === 'personal' ? '👤' : chat.type === 'group' ? '👥' : '📢'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{chat.name}</p>
                        <p className="text-xs text-gray-500 font-mono tracking-tight">{chat.chatId} {chat.threadId ? `• ${chat.threadId}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleTestMessage(chat)}
                        disabled={testing === chat.id}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title={t('recipients.testTooltip')}
                      >
                        {testing === chat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleChatActive(chat.id)}
                        className={`p-2 rounded-lg transition-colors ${chat.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-200'}`}
                      >
                        {chat.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleRemoveChat(chat.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {testResult && testResult.chatId === chat.id && (
                    <div className={`text-[11px] font-bold p-2 rounded mb-4 animate-in zoom-in-95 ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {testResult.message}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {(['newOrder', 'statusChange', 'lowStock'] as const).map((key) => {
                      const colors: Record<string, string> = { newOrder: 'blue', statusChange: 'purple', lowStock: 'orange' };
                      const color = colors[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleToggleChatNotification(chat.id, key)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            chat.notifications[key]
                              ? `bg-${color}-100 text-${color}-600 ring-1 ring-${color}-200`
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {t(`notifications.${key}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-semibold">{t('recipients.empty')}</p>
              <p className="text-sm px-4">{t('recipients.emptyDesc')}</p>
            </div>
          )}
        </div>

        {/* Новые сообщения от бота */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-blue-500 ${loadingUpdates ? 'animate-spin' : ''}`} /> {t('updates.title')}
            </h2>
            <button
              onClick={loadUpdates}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest"
            >
              {t('updates.refresh')}
            </button>
          </div>

          {loadingUpdates ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
          ) : updates.length ? (
            <div className="space-y-3">
              {updates.map((u) => (
                <div key={u.updateId} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate flex items-center gap-2">
                      <span className="text-lg">{u.type === 'thread' ? '🧵' : u.type === 'group' ? '👥' : '👤'}</span>
                      {u.userName || u.chatTitle || t('updates.unknown')}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      chatId: {u.chatId} {u.threadId && `• thread: ${u.threadId}`} {u.chatTitle && `• chatTitle: ${u.chatTitle}`}
                    </p>
                    {u.text && <p className="text-xs text-gray-600 mt-2 italic bg-white p-2 rounded-lg border border-gray-50 line-clamp-1">"{u.text}"</p>}
                  </div>

                  <button
                    onClick={() => {
                      const chat: TelegramChat = {
                        id: Date.now().toString(),
                        chatId: String(u.chatId),
                        threadId: u.threadId ? String(u.threadId) : undefined,
                        name: u.userName || u.chatTitle || t('updates.unknown'),
                        type: (u.type as any) || 'personal',
                        notifications: { newOrder: true, statusChange: true, lowStock: false },
                        isActive: true,
                      };
                      setSettings({ ...settings, chats: [...settings.chats, chat] });
                    }}
                    className="ml-4 flex-shrink-0 px-4 py-2 text-xs bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    {t('updates.add')}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6 italic">{t('updates.empty')}</p>
          )}
        </div>

        {/* Кнопка сохранения в футере */}
        <div className="pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black font-bold shadow-lg shadow-gray-200 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {t('saveButton')}
          </button>
        </div>
      </main>
    </div>
  );
}