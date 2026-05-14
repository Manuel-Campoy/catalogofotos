'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=No+pudimos+iniciar+sesión.+Revisa+tus+datos.')
  }

  const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', authData.user.id).single()
  const name = profile?.full_name?.split(' ')[0] || 'Usuario'
  const roleText = profile?.role === 'vendor' ? 'Fotógrafo' : 'Graduado'
  
  revalidatePath('/', 'layout')
  
  // Redirección condicional según el rol
  if (profile?.role === 'vendor') {
    redirect(`/dashboard?toast=login&name=${encodeURIComponent(name)}&role=${encodeURIComponent(roleText)}`)
  } else {
    redirect(`/?toast=login&name=${encodeURIComponent(name)}&role=${encodeURIComponent(roleText)}`)
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string).trim()
  const role = formData.get('role') as string 

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role
      }
    }
  })

  if (authError) {
    redirect('/registro?error=' + encodeURIComponent(authError.message))
  }
  
  const name = fullName.split(' ')[0] || 'Usuario'
  const roleText = role === 'vendor' ? 'Fotógrafo' : 'Graduado'

  revalidatePath('/', 'layout')
  
  // Redirección condicional según el rol también al registrarse
  if (role === 'vendor') {
    redirect(`/dashboard?toast=signup&name=${encodeURIComponent(name)}&role=${encodeURIComponent(roleText)}`)
  } else {
    redirect(`/?toast=signup&name=${encodeURIComponent(name)}&role=${encodeURIComponent(roleText)}`)
  }
}