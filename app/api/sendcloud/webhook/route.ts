import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { esc } from '@/lib/email'
import { createHmac, timingSafeEqual } from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ ok: true })
}

const STATUS_MAP: Record<number, string> = {
  1:    'en_attente',
  11:   'expédiée',
  12:   'expédiée',
  13:   'expédiée',
  15:   'expédiée',
  17:   'expédiée',
  21:   'livrée',
  22:   'livrée',
  93:   'livrée',
  92:   'expédiée',
  91:   'expédiée',
  99:   'annulée',
  1000: 'payée',
  1002: 'payée',
}

// Sendcloud signe le corps brut en HMAC-SHA256 (en-tête Sendcloud-Signature) avec la clé secrète de l'intégration.
function validSignature(raw: string, signature: string | null): boolean {
  const secret = process.env.SENDCLOUD_WEBHOOK_SECRET ?? process.env.SENDCLOUD_SECRET_KEY
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    if (!validSignature(raw, req.headers.get('sendcloud-signature'))) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
    }
    const body = JSON.parse(raw)
    const parcel = body.parcel ?? body

    if (!parcel) return NextResponse.json({ received: true })

    const trackingNumber: string = parcel.tracking_number ?? parcel.barcode ?? ''
    const orderNumber: string    = parcel.order_number ?? parcel.external_order_id ?? ''
    const statusId: number       = parcel.status?.id ?? 0
    const trackingUrl: string    = parcel.tracking_url ?? ''
    const newStatus              = STATUS_MAP[statusId]

    if (!orderNumber && !trackingNumber) return NextResponse.json({ received: true })

    const order = await prisma.order.findFirst({
      where: orderNumber ? { id: orderNumber } : { boxtalRef: trackingNumber },
      include: { items: true },
    })

    if (!order) return NextResponse.json({ received: true })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(trackingNumber && { boxtalRef: trackingNumber }),
        ...(newStatus      && { status: newStatus }),
        ...(trackingUrl    && { notes: `tracking:${trackingUrl}` }),
        updatedAt: new Date().toISOString(),
      },
    })

    if (newStatus === 'expédiée' && order.status !== 'expédiée') {
      await sendShippedEmail({
        to: order.customerEmail,
        customerName: order.customerName,
        trackingNumber,
        trackingUrl,
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[sendcloud/webhook]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

async function sendShippedEmail(data: {
  to: string
  customerName: string
  trackingNumber: string
  trackingUrl: string
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const FROM = `SADSAT <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`
  const trackingLink = data.trackingUrl || `https://www.mondialrelay.fr/suivi-de-colis/?NumColis=${esc(data.trackingNumber)}`

  await transporter.sendMail({
    from: FROM,
    to: data.to,
    subject: 'Votre commande SADSAT est en route',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:48px 24px;background:#0a0a0a;color:#e5e5e5;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">SADSAT</h1>
        <hr style="border:none;border-top:1px solid #262626;margin:24px 0 32px;" />
        <p style="font-size:15px;color:#d4d4d4;line-height:1.7;margin-bottom:16px;">Bonjour ${esc(data.customerName)},</p>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
          Votre commande a été expédiée. Suivez votre colis avec le numéro ci-dessous.
        </p>
        <div style="background:#1a1a1a;border:1px solid #262626;padding:20px;margin-bottom:32px;text-align:center;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:8px;">Numéro de suivi</p>
          <p style="font-family:monospace;font-size:18px;color:#e5e5e5;letter-spacing:0.1em;">${esc(data.trackingNumber)}</p>
        </div>
        <a href="${trackingLink}" style="display:inline-block;background:#e5e5e5;color:#0a0a0a;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 32px;">Suivre mon colis</a>
        <hr style="border:none;border-top:1px solid #262626;margin:40px 0;" />
        <p style="font-size:11px;color:#404040;letter-spacing:0.1em;">SADSAT · Taxidermie · Bougies</p>
      </div>
    `,
  })
}
