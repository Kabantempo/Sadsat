import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'SADSAT <noreply@sadsat.fr>'
const BASE = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${BASE()}/verify-email?token=${token}`
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Confirmez votre adresse email — SADSAT',
    html: emailLayout(`
      <p style="font-size:15px;color:#d4d4d4;line-height:1.7;margin-bottom:16px;">Bonjour ${name},</p>
      <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
        Merci de vous être inscrit sur SADSAT. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
      </p>
      <a href="${link}" style="${btnStyle}">Confirmer mon email</a>
      <p style="margin-top:32px;font-size:12px;color:#525252;line-height:1.6;">
        Ce lien expire dans 24 heures.<br/>Si vous n'avez pas créé de compte, ignorez cet email.
      </p>
    `),
  })
}

export async function sendSetPasswordEmail(to: string, name: string, token: string): Promise<boolean> {
  const link = `${BASE()}/set-password?token=${token}`
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Créez votre mot de passe — SADSAT',
      html: emailLayout(`
        <p style="font-size:15px;color:#d4d4d4;line-height:1.7;margin-bottom:16px;">Bonjour ${name},</p>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
          Votre compte SADSAT a été créé. Cliquez ci-dessous pour définir votre mot de passe.
        </p>
        <a href="${link}" style="${btnStyle}">Créer mon mot de passe</a>
        <p style="margin-top:32px;font-size:12px;color:#525252;line-height:1.6;">
          Ce lien expire dans 24 heures.
        </p>
      `),
    })
    return true
  } catch {
    return false
  }
}

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  await resend.emails.send({
    from: FROM,
    to: 'contact@sadsat.fr',
    replyTo: data.email,
    subject: `[Contact] ${data.subject} — ${data.name}`,
    html: emailLayout(`
      <p style="font-size:14px;color:#a3a3a3;margin-bottom:8px;"><strong style="color:#d4d4d4;">De :</strong> ${data.name} (${data.email})</p>
      <p style="font-size:14px;color:#a3a3a3;margin-bottom:24px;"><strong style="color:#d4d4d4;">Sujet :</strong> ${data.subject}</p>
      <p style="font-size:14px;color:#a3a3a3;line-height:1.8;white-space:pre-wrap;">${data.message}</p>
    `),
  })
}

const btnStyle = 'display:inline-block;background:#e5e5e5;color:#0a0a0a;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 32px;font-family:Georgia,serif;'

function emailLayout(content: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:48px 24px;background:#0a0a0a;color:#e5e5e5;">
      <h1 style="font-size:28px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">SADSAT</h1>
      <hr style="border:none;border-top:1px solid #262626;margin:24px 0 32px;" />
      ${content}
      <hr style="border:none;border-top:1px solid #262626;margin:40px 0;" />
      <p style="font-size:11px;color:#404040;letter-spacing:0.1em;">SADSAT · Taxidermie · Bijoux · Bougies</p>
    </div>
  `
}
