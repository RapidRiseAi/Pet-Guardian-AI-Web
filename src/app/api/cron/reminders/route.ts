import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { sendReminderEmails } from '@/lib/notifications/service';

export async function POST(request: Request) {
  const provided = request.headers.get('x-cron-secret');
  if (!env.cronSecret || provided !== env.cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await sendReminderEmails();
  return NextResponse.json({ ok: true, ...result });
}
