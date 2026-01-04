'use client';

import { useCallback } from 'react';
import { telegramSettingsAPI, TelegramSettings } from '@/lib/api';
import { Order } from '@/types/api';

export function useTelegram() {
  
  // Отправить уведомление о новом заказе
  const sendNewOrderNotification = useCallback(async (order: Order) => {
    try {
      const settings = await telegramSettingsAPI.get();
      if (!settings || !settings.isActive || !settings.botToken) return;
      
      const activeChats = settings.chats.filter(c => c.isActive && c.notifications.newOrder);
      if (activeChats.length === 0) return;
      
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newOrder',
          order,
          botToken: settings.botToken,
          chats: activeChats,
        }),
      });
    } catch (e) {
      console.error('Telegram notification error:', e);
    }
  }, []);
  
  // Отправить уведомление о смене статуса
  const sendStatusChangeNotification = useCallback(async (order: Order) => {
    try {
      const settings = await telegramSettingsAPI.get();
      if (!settings || !settings.isActive || !settings.botToken) return;
      
      const activeChats = settings.chats.filter(c => c.isActive && c.notifications.statusChange);
      if (activeChats.length === 0) return;
      
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'statusChange',
          order,
          botToken: settings.botToken,
          chats: activeChats,
        }),
      });
    } catch (e) {
      console.error('Telegram notification error:', e);
    }
  }, []);
  
  // Отправить уведомление о низком остатке
  const sendLowStockNotification = useCallback(async (product: { name: string; stock: number; sku?: string }) => {
    try {
      const settings = await telegramSettingsAPI.get();
      if (!settings || !settings.isActive || !settings.botToken) return;
      
      const activeChats = settings.chats.filter(c => c.isActive && c.notifications.lowStock);
      if (activeChats.length === 0) return;
      
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lowStock',
          product,
          botToken: settings.botToken,
          chats: activeChats,
        }),
      });
    } catch (e) {
      console.error('Telegram notification error:', e);
    }
  }, []);
  
  return {
    sendNewOrderNotification,
    sendStatusChangeNotification,
    sendLowStockNotification,
  };
}
