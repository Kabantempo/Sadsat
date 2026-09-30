import { redirect } from 'next/navigation'

// Le panier vit dans le tiroir du site et dans /checkout : cette ancienne page provisoire y renvoie.
export default function PanierPage() {
  redirect('/checkout')
}
