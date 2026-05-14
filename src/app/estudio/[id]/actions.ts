'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesión para dejar una reseña.' }
  }

  const vendorId = formData.get('vendorId') as string
  const rating = parseInt(formData.get('rating') as string)
  const packageName = formData.get('packageName') as string
  const reviewText = formData.get('reviewText') as string

  if (!rating || rating < 1 || rating > 5) return { error: 'Selecciona una calificación.' }
  if (!packageName) return { error: 'Selecciona el paquete contratado.' }
  if (!reviewText || reviewText.length < 15) return { error: 'Tu comentario debe tener al menos 15 caracteres.' }

  const { error } = await supabase.from('reviews').insert({
    vendor_id: parseInt(vendorId),
    profile_id: user.id,
    package_name: packageName,
    rating: rating,
    review_text: reviewText
  })

  if (error) {
    return { error: 'Hubo un error al publicar tu reseña.' }
  }

  revalidatePath(`/estudio/${vendorId}`)
  revalidatePath('/') 
  
  return { success: true }
}