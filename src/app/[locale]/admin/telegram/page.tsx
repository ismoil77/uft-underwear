'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { telegramSettingsAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2, Plus, Trash2, Send, Bot, Users, Bell, CheckCircle, XCircle, TestTube } from 'lucide-react';
import { TelegramChat, TelegramSettings, TelegramUpdate } from '@/types/api'




export default function AdminTelegramPage() {
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
})
  const [showAddChat, setShowAddChat] = useState(false);
const [updates, setUpdates] = useState<TelegramUpdate[]>([])
const [loadingUpdates, setLoadingUpdates] = useState(false)
const loadUpdates = async () => {
  setLoadingUpdates(true)
  try {
    const res = await fetch('/api/telegram/updates')
    const data = await res.json()
    setUpdates(data)
  } catch {}
  finally {
    setLoadingUpdates(false)
  }
}
useEffect(() => {
  loadUpdates()
}, [])

  useEffect(() => {
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
      alert('Настройки сохранены!');
    } catch (e) {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

const handleAddChat = () => {
  if (!newChat.chatId || !newChat.name) return

  const chat: TelegramChat = {
  id: Date.now().toString(),
  chatId: newChat.chatId,
  threadId: newChat.threadId || undefined, // Используем undefined вместо null
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
  })

  setNewChat({ chatId: '', threadId: '', name: '', type: 'personal' })
  setShowAddChat(false)
}

  const handleRemoveChat = (chatId: string) => {
    if (!confirm('Удалить получателя?')) return;
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
      alert('Сначала введите токен бота');
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
      setTestResult({ chatId: chat.id, success: false, message: 'Ошибка отправки' });
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Bot className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Telegram уведомления</h1>
        </div>
      </header>


      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Инструкция */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Как настроить:</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Создайте бота через <a href="https://t.me/BotFather" target="_blank" className="underline">@BotFather</a> и получите токен</li>
            <li>Добавьте бота в группу или напишите ему лично</li>
            <li>Узнайте Chat ID через <a href="https://t.me/getmyid_bot" target="_blank" className="underline">@getmyid_bot</a></li>
            <li>Добавьте получателей и настройте уведомления</li>
          </ol>
        </div>

        {/* Настройки бота */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5" /> Настройки бота
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-600">Активен</span>
              <div
                onClick={() => setSettings({ ...settings, isActive: !settings.isActive })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.isActive ? 'bg-green-500' : 'bg-gray-300'} relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.isActive ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </label>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bot Token *</label>
              <input
                type="password"
                placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                value={settings.botToken}
                onChange={(e) => setSettings({ ...settings, botToken: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Получите у @BotFather</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Username бота</label>
              <input
                type="text"
                placeholder="@your_shop_bot"
                value={settings.botUsername || ''}
                onChange={(e) => setSettings({ ...settings, botUsername: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Получатели */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Получатели уведомлений
            </h2>
            <button
              onClick={() => setShowAddChat(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </div>

          {/* Форма добавления */}
          {showAddChat && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-3">Новый получатель</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Chat ID *"
                  value={newChat.chatId}
                  onChange={(e) => setNewChat({ ...newChat, chatId: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />


<input
  type="text"
  placeholder="Thread ID (если тема)"
  value={newChat.threadId}
  onChange={(e) => setNewChat({ ...newChat, threadId: e.target.value })}
  className="px-3 py-2 border rounded-lg"
/>

                <input
                  type="text"
                  placeholder="Название *"
                  value={newChat.name}
                  onChange={(e) => setNewChat({ ...newChat, name: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={newChat.type}
                  onChange={(e) => setNewChat({ ...newChat, type: e.target.value as any })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="personal">👤 Личный чат</option>
  <option value="group">👥 Группа</option>
  <option value="channel">📢 Канал</option>
  <option value="thread">🧵 Тема (thread)</option>
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleAddChat} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Добавить
                </button>
                <button onClick={() => setShowAddChat(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm">
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Список получателей */}
          {settings.chats.length > 0 ? (
            <div className="space-y-3">
              {settings.chats.map((chat) => (
                <div key={chat.id} className={`border rounded-lg p-4 ${chat.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {chat.type === 'personal' ? '👤' : chat.type === 'group' ? '👥' : '📢'}
                      </span>
                      <div>
                        <p className="font-medium">{chat.name}</p>
                        <p className="text-sm text-gray-500 font-mono">{chat.chatId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestMessage(chat)}
                        disabled={testing === chat.id}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                        title="Отправить тестовое сообщение"
                      >
                        {testing === chat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleChatActive(chat.id)}
                        className={`p-2 rounded-lg ${chat.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {chat.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleRemoveChat(chat.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Результат теста */}
                  {testResult && testResult.chatId === chat.id && (
                    <div className={`text-sm p-2 rounded mb-3 ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {testResult.message}
                    </div>
                  )}
                  
                  {/* Настройки уведомлений */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'newOrder' as const, label: '🛒 Новые заказы', color: 'blue' },
                      { key: 'statusChange' as const, label: '📦 Смена статуса', color: 'purple' },
                      { key: 'lowStock' as const, label: '⚠️ Мало товара', color: 'orange' },
                    ].map((notif) => (
                      <button
                        key={notif.key}
                        onClick={() => handleToggleChatNotification(chat.id, notif.key)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          chat.notifications[notif.key]
                            ? `bg-${notif.color}-100 text-${notif.color}-700 ring-2 ring-${notif.color}-300`
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {notif.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Получатели не добавлены</p>
              <p className="text-sm">Добавьте Chat ID для получения уведомлений</p>
            </div>
          )}
        </div>

        {/* Кнопка сохранения */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Сохранить настройки
        </button>
      </main>
		{/* Новые сообщения от бота */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      🤖 Новые сообщения от бота
    </h2>
    <button
      onClick={loadUpdates}
      className="text-sm text-blue-600 hover:underline"
    >
      Обновить
    </button>
  </div>

  {loadingUpdates ? (
    <Loader2 className="w-5 h-5 animate-spin" />
  ) : updates.length ? (
    <div className="space-y-3">
      {updates.map((u) => (
        <div
          key={u.updateId}
          className="border rounded-lg p-3 flex justify-between items-start"
        >
          <div>
            <p className="font-medium">
              {u.type === 'thread' ? '🧵' : u.type === 'group' ? '👥' : '👤'}{' '}
              {u.userName}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              chatId: {u.chatId}
              {u.threadId && ` • threadId: ${u.threadId}`}
            </p>
				 <p className="text-xs text-gray-500 font-mono">
              chatTitle: {u.chatTitle}
              
            </p>
            {u.text && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {u.text}
              </p>
            )}
          </div>

          <button
           onClick={() => {
  const newBotChat: TelegramChat = {
    id: Date.now().toString(),
    chatId: String(u.chatId),
    threadId: u.threadId ? String(u.threadId) : undefined,
    chatTitle: u.chatTitle || '',
    name: u.userName || u.chatTitle || 'Unknown',
    type: (u.type as any) || 'personal',
    notifications: {
      newOrder: true,
      statusChange: true,
      lowStock: false,
    },
    isActive: true,
  };

  setSettings({
    ...settings,
    chats: [...settings.chats, newBotChat],
  });
}}
            className="ml-3 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ➕ Добавить
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      Пока нет сообщений. Напишите боту или в группу.
    </p>
  )}
</div>

    </div>
  );
}
