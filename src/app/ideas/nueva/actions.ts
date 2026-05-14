'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIdea(formData: FormData) {
  const supabase = await createClient()
  
  // Verificamos quién está creando la idea
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?error=Debes+iniciar+sesión+para+publicar')
  }

  // Extraemos los datos del formulario
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const city = formData.get('city') as string
  const budget = formData.get('budget') as string
  // Obtenemos todas las etiquetas seleccionadas (checkboxes)
  const tags = formData.getAll('tags') as string[]

  const { error } = await supabase.from('ideas').insert({
    profile_id: user.id,
    title,
    description,
    city,
    budget,
    tags
  })

  if (error) {
    redirect('/ideas/nueva?error=No+pudimos+publicar+tu+idea')
  }

  revalidatePath('/')
  redirect('/?toast=idea_created')
}