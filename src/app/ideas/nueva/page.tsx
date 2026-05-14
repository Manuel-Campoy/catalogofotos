import { createIdea } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NuevaIdeaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;
  const supabase = await createClient()
  
  // Seguridad: Verificamos si hay sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=Debes+iniciar+sesión+para+publicar')

  // Seguridad: Verificamos que sea un Graduado y no un Fotógrafo
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#B8923A]/20 text-center max-w-md">
          <div className="text-4xl mb-4">📸</div>
          <h2 className="font-serif text-2xl text-[#111008] mb-2">Acceso denegado</h2>
          <p className="text-sm text-[#6B6558] mb-6">Solo los graduados pueden publicar ideas de sesión. Como fotógrafo, tu rol es explorarlas y contactarlos.</p>
          <Link href="/#ideas" className="text-[#B8923A] font-medium hover:underline">Volver al tablero</Link>
        </div>
      </div>
    )
  }

  const tagsList = ['Exterior', 'Interior', 'Atardecer', 'Urbano', 'Natural', 'Artístico', 'Formal', 'Playa', 'Nocturno', 'Editorial']

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6] px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-xl border border-[#B8923A]/20">
        <div className="flex justify-between items-start mb-2">
          <h1 className="font-serif text-2xl font-bold text-[#111008]">Comparte tu idea de sesión</h1>
          <Link href="/#ideas" className="text-2xl text-[#9E9888] hover:text-[#111008]">×</Link>
        </div>
        <p className="text-[13px] text-[#6B6558] mb-6">
          Describe cómo imaginas tus fotos. Los fotógrafos verán tu idea y podrán contactarte.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        <form action={createIdea} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Título de tu idea</label>
            <input name="title" required placeholder="Ej: Sesión en ruinas industriales al atardecer" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Describe tu visión</label>
            <textarea name="description" required minLength={20} rows={4} placeholder="Cuéntanos qué ambiente, colores, locación o estilo tienes en mente…" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A] resize-y"></textarea>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tagsList.map(tag => (
                <label key={tag} className="cursor-pointer">
                  <input type="checkbox" name="tags" value={tag} className="peer sr-only" />
                  <span className="px-3 py-1.5 rounded-full border border-[#B8923A]/20 text-xs text-[#6B6558] transition-all peer-checked:bg-[#111008] peer-checked:text-white peer-checked:border-[#111008] hover:border-[#B8923A]">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Ciudad</label>
              <select name="city" required className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]">
                <option value="">Selecciona…</option>
                <option value="Hermosillo">Hermosillo</option>
                <option value="Obregón">Obregón</option>
                <option value="Nogales">Nogales</option>
                <option value="Guaymas">Guaymas</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Presupuesto</label>
              <select name="budget" required className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]">
                <option value="No definido">No definido</option>
                <option value="Menos de MX$2,000">Menos de MX$2,000</option>
                <option value="MX$2,000 – $4,000">MX$2,000 – $4,000</option>
                <option value="MX$4,000 – $7,000">MX$4,000 – $7,000</option>
                <option value="Más de MX$7,000">Más de MX$7,000</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-[#111008] text-[#FDFBF6] py-3 rounded-md text-[14px] font-medium hover:bg-[#2C2A22] transition-colors shadow-lg">
            Publicar idea
          </button>
        </form>
      </div>
    </div>
  )
}