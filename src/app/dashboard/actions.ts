'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateVendorProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const city = formData.get('city') as string
  const contact_phone = formData.get('phone') as string
  const logo_url = formData.get('logo_url') as string
  const cover_url = formData.get('cover_url') as string

  const { error } = await supabase
    .from('vendors')
    .update({
      name,
      description,
      city,
      contact_phone,
      logo_url,
      cover_url
    })
    .eq('profile_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/')

}

export async function addPackage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const vendorId = formData.get('vendorId') as string
  const name = formData.get('name') as string
  const price = parseInt(formData.get('price') as string)
  const tier = formData.get('tier') as string
  const features = (formData.get('features') as string).split(',').map(f => f.trim())

  await supabase.from('packages').insert({
    vendor_id: parseInt(vendorId),
    name,
    price,
    tier,
    features
  })

  revalidatePath('/dashboard')
  revalidatePath(`/estudio/${vendorId}`)
}

export async function deletePackage(id: number, vendorId: number) {
  const supabase = await createClient()
  await supabase.from('packages').delete().eq('id', id)
  revalidatePath('/dashboard')
  revalidatePath(`/estudio/${vendorId}`)
}