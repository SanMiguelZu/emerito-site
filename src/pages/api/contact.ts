import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TYPE_LABELS: Record<string, string> = {
  insight: 'Diagnóstico (Cauce Insight)',
  studio: 'Producción completa (Cauce Studio)',
  unsure: 'No estoy seguro/a',
  other: 'Otro',
};

export const POST: APIRoute = async ({ request }) => {
  const json = (data: object, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot — bots fill this; real users never see it
  if (body.get('website')) {
    return json({ ok: true }); // Silent success to confuse bots
  }

  const nombre = (body.get('nombre') as string | null)?.trim() ?? '';
  const email = (body.get('email') as string | null)?.trim() ?? '';
  const empresa = (body.get('empresa') as string | null)?.trim() ?? '';
  const tipo = (body.get('tipo') as string | null)?.trim() ?? '';
  const mensaje = (body.get('mensaje') as string | null)?.trim() ?? '';

  if (!nombre || !email || !tipo || !mensaje) {
    return json({ error: 'Por favor completá todos los campos requeridos.' }, 422);
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return json({ error: 'El email no es válido.' }, 422);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const contactEmail = import.meta.env.CONTACT_EMAIL ?? 'michael@emerito.co';

  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    return json({ error: 'Error de configuración. Escribinos directamente a michael@emerito.co' }, 500);
  }

  const resend = new Resend(apiKey);
  const tipoLabel = TYPE_LABELS[tipo] ?? tipo;

  const notificationHtml = `
    <h2 style="margin:0 0 16px;font-family:sans-serif;">Nuevo mensaje desde emerito.co</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Nombre</td><td style="padding:6px 0;">${escHtml(nombre)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Email</td><td style="padding:6px 0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
      ${empresa ? `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Empresa</td><td style="padding:6px 0;">${escHtml(empresa)}</td></tr>` : ''}
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Tipo</td><td style="padding:6px 0;">${escHtml(tipoLabel)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Mensaje</td><td style="padding:6px 0;white-space:pre-wrap;">${escHtml(mensaje)}</td></tr>
    </table>
  `;

  const autoReplyHtml = `
    <p style="font-family:sans-serif;font-size:15px;color:#1A1A1A;">Hola ${escHtml(nombre)},</p>
    <p style="font-family:sans-serif;font-size:15px;color:#1A1A1A;">Recibimos tu mensaje. Te respondemos en menos de 48 horas.</p>
    <p style="font-family:sans-serif;font-size:15px;color:#1A1A1A;">— Equipo Emerito</p>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
    <p style="font-family:sans-serif;font-size:12px;color:#999;">emerito.co · Medellín, Colombia</p>
  `;

  try {
    const [notification, autoReply] = await Promise.all([
      resend.emails.send({
        from: 'Formulario Emerito <noreply@emerito.co>',
        to: contactEmail,
        replyTo: email,
        subject: `Nuevo contacto: ${nombre}${empresa ? ` — ${empresa}` : ''}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: 'Emerito <noreply@emerito.co>',
        to: email,
        subject: 'Recibimos tu mensaje',
        html: autoReplyHtml,
      }),
    ]);

    if (notification.error || autoReply.error) {
      console.error('Resend errors:', notification.error, autoReply.error);
      return json({ error: 'No pudimos enviar el mensaje. Escribinos directamente a michael@emerito.co' }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Resend exception:', err);
    return json({ error: 'Error inesperado. Escribinos directamente a michael@emerito.co' }, 500);
  }
};

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
