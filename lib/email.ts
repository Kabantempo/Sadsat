import 'server-only'

export async function sendSetPasswordEmail(
  to: string,
  name: string,
  token: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const link = `${baseUrl}/set-password?token=${token}`

  if (!apiKey) {
    console.log(`[SADSAT] Pas de RESEND_API_KEY — lien de création de mot de passe pour ${to} :\n${link}`)
    return false
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'SADSAT <noreply@sadsat.fr>'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Créez votre mot de passe — SADSAT',
        html: buildHtml(name, link),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

type ContactPayload = { name: string; email: string; subject: string; message: string }

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL ?? 'contact@sadsat.fr'
  const from = process.env.RESEND_FROM_EMAIL ?? 'SADSAT <noreply@sadsat.fr>'

  if (!apiKey) {
    console.log(`[SADSAT] Contact de ${payload.name} <${payload.email}>\nSujet: ${payload.subject}\n${payload.message}`)
    return
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[SADSAT Contact] ${payload.subject}`,
      html: `<div style="font-family:sans-serif;max-width:600px;padding:32px 20px;">
        <p style="color:#999;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 20px;">Message de contact — SADSAT</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:8px 0;color:#777;font-size:0.8rem;width:80px;">Nom</td><td style="padding:8px 0;font-size:0.88rem;color:#333;">${payload.name}</td></tr>
          <tr><td style="padding:8px 0;color:#777;font-size:0.8rem;">Email</td><td style="padding:8px 0;font-size:0.88rem;color:#333;"><a href="mailto:${payload.email}" style="color:#333;">${payload.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#777;font-size:0.8rem;">Sujet</td><td style="padding:8px 0;font-size:0.88rem;color:#333;">${payload.subject}</td></tr>
        </table>
        <div style="background:#f5f5f5;padding:20px;border-left:3px solid #ddd;">
          <p style="font-size:0.88rem;color:#444;line-height:1.7;white-space:pre-wrap;margin:0;">${payload.message}</p>
        </div>
      </div>`,
    }),
  }).catch(() => null)
}

function buildHtml(name: string, link: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e5e5;padding:40px;">
        <tr><td>
          <p style="font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:#999;margin:0 0 24px;">SADSAT</p>
          <h1 style="font-size:1.4rem;font-weight:300;color:#171717;margin:0 0 12px;">Bienvenue, ${name}</h1>
          <p style="font-size:0.88rem;color:#555;line-height:1.6;margin:0 0 28px;">
            Votre compte a été créé sur SADSAT.<br/>
            Cliquez sur le bouton ci-dessous pour choisir votre mot de passe.<br/>
            Ce lien est valable <strong>24 heures</strong>.
          </p>
          <a href="${link}" style="display:inline-block;background:#171717;color:#fff;padding:14px 28px;text-decoration:none;font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;">
            Créer mon mot de passe →
          </a>
          <p style="font-size:0.72rem;color:#aaa;margin:28px 0 0;line-height:1.5;">
            Si ce bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
            <span style="color:#666;">${link}</span>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:0.68rem;color:#bbb;margin:0;">
            Si vous n'attendiez pas cet email, ignorez-le simplement.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
