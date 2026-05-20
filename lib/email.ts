import 'server-only'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.SMTP_FROM
  ? `SADSAT <${process.env.SMTP_FROM}>`
  : `SADSAT <${process.env.SMTP_USER}>`
const BASE = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<boolean> {
  const link = `${BASE()}/verify-email?token=${token}`
  try {
    await transporter.sendMail({
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
    return true
  } catch (err) {
    console.error('[email] sendVerificationEmail failed:', err)
    return false
  }
}

export async function sendSetPasswordEmail(to: string, name: string, token: string, role: 'créateur' | 'grossiste' | 'admin' = 'admin'): Promise<boolean> {
  const link = `${BASE()}/set-password?token=${token}`
  const isCreateur = role === 'créateur'
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: isCreateur ? 'Bienvenue dans le collectif SADSAT — Créez votre mot de passe' : 'Créez votre mot de passe — SADSAT',
      html: emailLayout(`
        <p style="font-size:15px;color:#d4d4d4;line-height:1.7;margin-bottom:16px;">Bonjour ${name},</p>
        ${isCreateur ? `
        <p style="font-size:18px;font-style:italic;color:#e5e5e5;line-height:1.6;margin-bottom:16px;">
          Bienvenue dans le collectif SADSAT.
        </p>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
          Tu es maintenant créateur au sein du collectif. Crée ton mot de passe ci-dessous pour accéder à ton espace et commencer à partager ton univers.
        </p>
        ` : `
        <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
          Votre compte SADSAT a été créé. Cliquez ci-dessous pour définir votre mot de passe.
        </p>
        `}
        <a href="${link}" style="${btnStyle}">Créer mon mot de passe</a>
        <p style="margin-top:32px;font-size:12px;color:#525252;line-height:1.6;">
          Ce lien expire dans 24 heures.
        </p>
      `),
    })
    return true
  } catch (err) {
    console.error('[email] sendSetPasswordEmail failed:', err)
    return false
  }
}

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM,
      to: 'contact@sadsat.com',
      replyTo: data.email,
      subject: `[Contact] ${data.subject} — ${data.name}`,
      html: emailLayout(`
        <p style="font-size:14px;color:#a3a3a3;margin-bottom:8px;"><strong style="color:#d4d4d4;">De :</strong> ${data.name} (${data.email})</p>
        <p style="font-size:14px;color:#a3a3a3;margin-bottom:24px;"><strong style="color:#d4d4d4;">Sujet :</strong> ${data.subject}</p>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.8;white-space:pre-wrap;">${data.message}</p>
      `),
    })
    return true
  } catch (err) {
    console.error('[email] sendContactEmail failed:', err)
    return false
  }
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
