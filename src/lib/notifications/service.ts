import { Resend } from 'resend';
import { env } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function createInAppNotification(input: {
  recipientProfileId: string;
  actorProfileId?: string | null;
  petId?: string | null;
  title: string;
  body?: string | null;
  actionUrl?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();
  return admin.from('notifications').insert({
    recipient_profile_id: input.recipientProfileId,
    actor_profile_id: input.actorProfileId ?? null,
    pet_id: input.petId ?? null,
    channel: 'in_app',
    title: input.title,
    body: input.body ?? null,
    action_url: input.actionUrl ?? null,
    metadata: input.metadata ?? {},
  });
}

export async function sendReminderEmails(now = new Date()) {
  const admin = createSupabaseAdminClient();
  const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

  const from = new Date(now.getTime() - 5 * 60_000).toISOString();
  const to = new Date(now.getTime() + 24 * 60 * 60_000).toISOString();

  const { data: reminders } = await admin
    .from('reminders')
    .select('id,pet_id,title,instructions,due_at,created_by,channels,pets(name),profiles!reminders_created_by_fkey(id,full_name)')
    .in('status', ['scheduled', 'overdue'])
    .gte('due_at', from)
    .lte('due_at', to)
    .is('deleted_at', null)
    .limit(100);

  let processed = 0;
  for (const reminder of reminders ?? []) {
    const { data: already } = await admin
      .from('reminder_deliveries')
      .select('id')
      .eq('reminder_id', reminder.id)
      .eq('channel', 'email')
      .maybeSingle();
    if (already) continue;

    const recipientId = reminder.created_by;
    const { data: pref } = await admin
      .from('notification_preferences')
      .select('enabled')
      .eq('profile_id', recipientId)
      .eq('channel', 'email')
      .maybeSingle();
    if (pref && !pref.enabled) continue;

    const { data: profile } = await admin.from('profiles').select('id').eq('id', recipientId).maybeSingle();
    if (!profile) continue;

    const { data: authUser } = await admin.auth.admin.getUserById(recipientId);
    const email = authUser.user?.email;
    if (!email) continue;

    let providerMessageId: string | null = null;
    let status: 'queued' | 'sent' | 'failed' = 'queued';
    let errorMessage: string | null = null;

    if (resend) {
      try {
        const res = await resend.emails.send({
          from: env.emailFrom,
          to: [email],
          replyTo: env.emailReplyTo,
          subject: `Reminder: ${reminder.title}`,
          html: `<p><strong>${reminder.title}</strong></p><p>${reminder.instructions ?? ''}</p><p>Due: ${new Date(reminder.due_at).toLocaleString()}</p>`,
        });
        providerMessageId = (res.data as { id?: string } | null)?.id ?? null;
        status = 'sent';
      } catch (error) {
        status = 'failed';
        errorMessage = error instanceof Error ? error.message : 'email send failed';
      }
    }

    await admin.from('reminder_deliveries').insert({
      reminder_id: reminder.id,
      recipient_profile_id: recipientId,
      channel: 'email',
      status,
      provider_message_id: providerMessageId,
      scheduled_for: reminder.due_at,
      delivered_at: status === 'sent' ? new Date().toISOString() : null,
      error_message: errorMessage,
      metadata: { source: 'cron-reminders' },
    });

    await createInAppNotification({
      recipientProfileId: recipientId,
      petId: reminder.pet_id,
      title: `Reminder due: ${reminder.title}`,
      body: `Due ${new Date(reminder.due_at).toLocaleString()}.`,
      actionUrl: '/app/reminders',
      metadata: { reminderId: reminder.id },
    });

    processed += 1;
  }

  return { processed };
}
