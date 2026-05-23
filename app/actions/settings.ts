'use server'
import { revalidatePath } from 'next/cache'
import { setSetting } from '@/lib/settings'
import { verifyAdmin } from '@/lib/dal'

export async function updateGrossisteDiscountAction(formData: FormData) {
  await verifyAdmin()
  const discount = formData.get('discount') as string
  const val = parseInt(discount)
  if (isNaN(val) || val < 0 || val > 100) return
  await setSetting('grossiste_discount', String(val))
  revalidatePath('/admin/parametres')
  revalidatePath('/grossiste')
  revalidatePath('/grossiste/catalogue')
}
