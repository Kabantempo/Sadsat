import 'server-only'

const BASE = 'https://panel.sendcloud.sc/api/v2'

function auth() {
  const token = Buffer.from(
    `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
  ).toString('base64')
  return `Basic ${token}`
}

export type SendcloudParcel = {
  id: number
  tracking_number: string
  tracking_url: string
  label: { normal_printer: string[] }
  status: { id: number; message: string }
}

export async function createParcel(data: {
  name: string
  email: string
  phone?: string | null
  address: string
  city: string
  postal_code: string
  country: string
  order_number: string
  weight: number
  shipping_method_checkout_name?: string
}): Promise<SendcloudParcel> {
  const res = await fetch(`${BASE}/parcels`, {
    method: 'POST',
    headers: {
      Authorization: auth(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: {
        name: data.name,
        email: data.email,
        telephone: data.phone ?? '',
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        order_number: data.order_number,
        weight: String(data.weight),
        shipment: { id: 8 }, // Mondial Relay — id à ajuster selon ton contrat
        request_label: true,
      },
    }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json?.error?.message ?? `Sendcloud error ${res.status}`)
  }
  return json.parcel as SendcloudParcel
}

export async function getShippingMethods(): Promise<{ id: number; name: string; carrier: string }[]> {
  const res = await fetch(`${BASE}/shipping_methods`, {
    headers: { Authorization: auth() },
  })
  const json = await res.json()
  return json.shipping_methods ?? []
}
