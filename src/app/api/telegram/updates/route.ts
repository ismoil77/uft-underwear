import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/getUpdates',
    { cache: 'no-store' }
  )

  const data = await res.json()

  if (!data.ok) {
    return NextResponse.json({ error: 'Telegram error' }, { status: 500 })
  }

  const updates = data.result
    .map((u: any) => {
      const msg = u.message || u.channel_post
      if (!msg) return null

      return {
        updateId: u.update_id,
        chatId: String(msg.chat.id),
        threadId: msg.message_thread_id
          ? String(msg.message_thread_id)
          : null,
        userId: msg.from?.id,
        userName:
          msg.from?.username ||
          [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') ||
          msg.chat.title ||
          'Unknown',
        chatTitle: msg.chat.title,
        type:
          msg.message_thread_id
            ? 'thread'
            : msg.chat.type === 'private'
            ? 'personal'
            : msg.chat.type,
        text: msg.text || '',
      }
    })
    .filter(Boolean)
    .slice(-10) // последние 10

  return NextResponse.json(updates)
}
