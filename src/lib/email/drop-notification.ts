import { Resend } from 'resend';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDropNotificationEmail(drop: { id: string; title: string; categories: { name: string } }) {
  const supabase = createSupabaseAdminClient();
  const { data: users } = await supabase
    .from('users')
    .select('email, discord_username')
    .eq('email_notifications', true)
    .not('email', 'is', null);

  if (!users?.length) return;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:system-ui;color:#F5F5F5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <tr><td style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1A1A1A;">
          <span style="font-size:24px;font-weight:400;letter-spacing:-0.02em;">EDITX VAULT</span>
        </td></tr>
        <tr><td style="padding:32px 0;">
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;line-height:1.2;">New Drop: ${drop.title}</h1>
          <p style="margin:0 0 24px;color:#71717A;line-height:1.6;">A new asset just landed in the Vault. Category: <strong style="color:#F5F5F5;">${drop.categories?.name}</strong></p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/today" style="display:inline-block;padding:14px 28px;background:#06B6D4;color:#0A0A0A;text-decoration:none;font-weight:500;border-radius:4px;">Download Now</a>
        </td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #1A1A1A;text-align:center;color:#3F3F46;font-size:13px;">
          You're receiving this because you opted in to drop notifications.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="color:#06B6D4;">Manage preferences</a>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: users.map((u: any) => u.email!),
    subject: `New Drop: ${drop.title} — EditX Vault`,
    html: emailHtml,
  });
}