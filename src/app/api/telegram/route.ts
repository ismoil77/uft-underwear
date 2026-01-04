import { TELEGRAM_CONFIG } from '@/config/api.config'
import { Order } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, photo, caption, document, documentName } = await request.json();
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    
    console.log('Telegram API Route called');
    console.log('Has token:', !!botToken);
    console.log('Has chatId:', !!chatId);
    
    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials');
      return NextResponse.json(
        { error: 'Telegram credentials not configured' },
        { status: 500 }
      );
    }
    
    // Если есть фото - отправляем фото с подписью
    if (photo) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      
      console.log('Sending photo to Telegram...');
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photo,
          caption: caption || message,
          parse_mode: 'HTML',
        }),
      });
      
      const result = await response.json();
      console.log('Telegram photo response:', result);
      
      if (!response.ok) {
        console.error('Telegram API error:', result);
        return NextResponse.json(
          { error: 'Telegram API error', details: result },
          { status: response.status }
        );
      }
      
      return NextResponse.json({ success: true, result });
    }
    
    // Отправляем текст
    if (!message) {
      return NextResponse.json(
        { error: 'Message or photo is required' },
        { status: 400 }
      );
    }
    
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('Sending message to Telegram...');
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    const result = await response.json();
    
    console.log('Telegram response:', result);
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      return NextResponse.json(
        { error: 'Telegram API error', details: result },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error in Telegram API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

function formatOrderMessage(order: Order): string {
	const itemsList = order.items
		.map(
			item =>
				`  • ${item.name} × ${item.quantity} = ${(
					item.price * item.quantity
				).toLocaleString()} UZS`
		)
		.join('\n')

	return `
🛒 <b>НОВЫЙ ЗАКАЗ!</b>

👤 <b>Клиент:</b> ${order.name}
📱 <b>Телефон:</b> ${order.phone}
${order.email ? `📧 <b>Email:</b> ${order.email}` : ''}
${order.address ? `📍 <b>Адрес:</b> ${order.address}` : ''}

📦 <b>Товары:</b>
${itemsList}

💰 <b>ИТОГО: ${order.total.toLocaleString()} UZS</b>

${order.comment ? `💬 <b>Комментарий:</b> ${order.comment}` : ''}

📅 ${new Date().toLocaleString('ru-RU')}
  `.trim()
}
