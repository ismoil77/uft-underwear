import { TELEGRAM_CONFIG } from '@/config/api.config'
import { Order } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server';
async function getTelegramConfig() {
  const res = await fetch(
    'https://dfe9a3e83bdc7f15.mokky.dev/telegramSettings',
    { cache: 'no-store' }
  )

  if (!res.ok) throw new Error('Failed to load telegram settings')

  const data = await res.json()
  const activeBot = data.find((b: any) => b.isActive)

  if (!activeBot?.botToken) {
    throw new Error('No active telegram bot')
  }

  const chats = (activeBot.chats || []).filter((c: any) => c.isActive)

  if (!chats.length) {
    throw new Error('No active telegram chats')
  }

  return {
    botToken: activeBot.botToken,
    chats,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const { botToken, chats } = await getTelegramConfig()

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    await Promise.all(
      chats.map((chat: any) =>
        fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chat.chatId,
            ...(chat.threadId && {
              message_thread_id: Number(chat.threadId),
            }),
            text: message,
            parse_mode: 'HTML',
          }),
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: e.message },
      { status: 500 }
    )
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const { message, photo, caption, document, documentName } = await request.json();
    
//    const { botToken, chats } = await getTelegramConfig()

    
//     console.log('Telegram API Route called');
//     console.log('Has token:', !!botToken);
//   if (!botToken || !chats.length) {
//   console.error('Missing Telegram credentials');
//   return NextResponse.json(
//     { error: 'Telegram credentials not configured' },
//     { status: 500 }
//   );
// }

    
//     // Если есть фото - отправляем фото с подписью
//     if (photo) {
// const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

// await Promise.all(
//   chats.map((chat: any) =>
//     fetch(telegramUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: chat.chatId,
//         text: message,
//         parse_mode: 'HTML',
//       }),
//     })
//   )
// )

// return NextResponse.json({ success: true })


// }

    
//     // Отправляем текст
//     if (!message) {
//       return NextResponse.json(
//         { error: 'Message or photo is required' },
//         { status: 400 }
//       );
//     }
    
// const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

// await Promise.all(
//   chats.map((chat: any) =>
//     fetch(telegramUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: chat.chatId,
//         text: message,
//         parse_mode: 'HTML',
//       }),
//     })
//   )
// )

// return NextResponse.json({ success: true })

    
//     return NextResponse.json({ success: true, result });
//   } catch (error) {
//     console.error('Error in Telegram API route:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', details: String(error) },
//       { status: 500 }
//     );
//   }
// }

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
