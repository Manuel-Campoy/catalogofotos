'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return 

  const receiverId = formData.get('receiverId') as string
  const content = formData.get('content') as string
  const ideaId = formData.get('ideaId') as string

  if (!content.trim()) return 

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: content.trim(),
    idea_id: ideaId ? parseInt(ideaId) : null
  })

  if (error) {
    console.error(error)
    return 
  }

  revalidatePath('/mensajes')
}