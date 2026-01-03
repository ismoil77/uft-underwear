import { TELEGRAM_CONFIG } from '@/config/api.config'
import { Order } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const order: Order = await request.json()

		// Проверяем конфиг
		if (
			!TELEGRAM_CONFIG.enabled ||
			!TELEGRAM_CONFIG.botToken ||
			!TELEGRAM_CONFIG.chatId
		) {
			console.log('Telegram not configured, skipping...')
			return NextResponse.json({
				success: true,
				message: 'Telegram not configured',
			})
		}

		// Формируем сообщение
		const message = formatOrderMessage(order)

		// Отправляем в Telegram
		const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`

		const response = await fetch(telegramUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: TELEGRAM_CONFIG.chatId,
				text: message,
				parse_mode: 'HTML',
			}),
		})

		if (!response.ok) {
			const error = await response.text()
			console.error('Telegram API error:', error)
			return NextResponse.json({ success: false, error }, { status: 500 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Telegram send error:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		)
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
