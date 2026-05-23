import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Sendcloud status IDs → notre statut commande
const STATUS_MAP: Record<number, string> = {
  1:    'en_attente',   // Annoncé
  11:   'expédiée',    // En transit
  12:   'expédiée',    // Arrivé au tri
  13:   'expédiée',    // En cours de livraison
  15:   'expédiée',    // Pris en charge transporteur
  17:   'expédiée',    // En livraison
  21:   'livrée',      // Livré
  22:   'livrée',      // Livré en boîte aux lettres
  93:   'livrée',      // Livré chez voisin
  92:   'expédiée',    // Collecté en point relais
  91:   'expédiée',    // Retard livraison
  99:   'annulée',     // Annulé
  1000: 'payée',       // Prêt à expédier
  1002: 'payée',       // Erreur d'enregistrement
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Sendcloud envoie soit un objet direct soit { action, parcel }
    const parcel = body.parcel ?? body

    if (!parcel) {
      return NextResponse.json({ error: 'Payload invalide' }, { status: 400 })
    }

    const trackingNumber: string = parcel.tracking_number ?? parcel.barcode ?? ''
    const orderNumber: string = parcel.order_number ?? parcel.external_order_id ?? ''
    const statusId: number = parcel.status?.id ?? 0
    const trackingUrl: string = parcel.tracking_url ?? ''

    const newStatus = STATUS_MAP[statusId]

    if (!orderNumber && !trackingNumber) {
      return NextResponse.json({ received: true })
    }

    // Trouver la commande — par order_number (notre id) ou par tracking
    const order = await prisma.order.findFirst({
      where: orderNumber
        ? { id: orderNumber }
        : { boxtalRef: trackingNumber },
      include: { items: true },
    })

    if (!order) {
      console.warn('[sendcloud/webhook] Commande introuvable:', { orderNumber, trackingNumber })
      return NextResponse.json({ received: true })
    }

    // Mettre à jour tracking + statut
    await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(trackingNumber && { boxtalRef: trackingNumber }),
        ...(newStatus && { status: newStatus }),
        ...(trackingUrl && { notes: `tracking:${trackingUrl}` }),
        updatedAt: new Date().toISOString(),
      },
    })

    // Email client quand c'est expédié (une seule fois)
    if (newStatus === 'expédiée' && order.status !== 'expédiée') {
      await sendShippedEmail({
        to: order.customerEmail,
        customerName: order.customerName,
        trackingNumber,
        trackingUrl,
        items: order.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total: order.total,
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
  items: { name: string; price: number; quantity: number }[]
  total: number
}) {
  const { sendMail } = await import('@/lib/email').then(m => ({ sendMail: m.sendOrderConfirmationEmail }))
  // On réutilise le layout email pour l'expédition
  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const FROM = `SADSAT <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`
  const trackingLink = data.trackingUrl || `https://www.mondialrelay.fr/suivi-de-colis/?NumColis=${data.trackingNumber}`

  await transporter.sendMail({
    from: FROM,
    to: data.to,
    subject: 'Votre commande SADSAT est en route 📦',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:48px 24px;background:#0a0a0a;color:#e5e5e5;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">SADSAT</h1>
        <hr style="border:none;border-top:1px solid #262626;margin:24px 0 32px;" />
        <p style="font-size:15px;color:#d4d4d4;line-height:1.7;margin-bottom:16px;">Bonjour ${data.customerName},</p>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.7;margin-bottom:32px;">
          Votre commande a été expédiée. Vous pouvez suivre votre colis avec le numéro ci-dessous.
        </p>
        <div style="background:#1a1a1a;border:1px solid #262626;padding:20px;margin-bottom:32px;text-align:center;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:8px;">Numéro de suivi</p>
          <p style="font-family:monospace;font-size:18px;color:#e5e5e5;letter-spacing:0.1em;">${data.trackingNumber}</p>
        </div>
        <a href="${trackingLink}" style="display:inline-block;background:#e5e5e5;color:#0a0a0a;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 32px;font-family:Georgia,serif;">Suivre mon colis</a>
        <hr style="border:none;border-top:1px solid #262626;margin:40px 0;" />
        <p style="font-size:11px;color:#404040;letter-spacing:0.1em;">SADSAT · Taxidermie · Bijoux · Bougies</p>
      </div>
    `,
  })
}
