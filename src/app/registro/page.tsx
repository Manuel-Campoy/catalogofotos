'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [role, setRole] = useState<'client' | 'vendor'>('client')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6] px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-[#B8923A]/20">
        <div className="text-center mb-6">
          <Link href="/" className="font-serif text-2xl font-bold text-[#111008]">
            Grad<span className="text-[#B8923A]">Lens</span>
          </Link>
          <p className="text-[13px] text-[#6B6558] mt-2">Crea tu cuenta gratis</p>
        </div>

        <form action={signup} className="flex flex-col gap-5">
          {/* Selector de Rol */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">
              ¿Cómo quieres usar GradLens?
            </label>
            <input type="hidden" name="role" value={role} />
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 rounded-lg border text-center transition-all relative ${role === 'client' ? 'border-[#B8923A] bg-[#FBF4E3] ring-2 ring-[#B8923A]/20' : 'border-[#B8923A]/20 bg-[#F5F1E8] hover:border-[#D4AE62]'}`}
              >
                <div className="text-2xl mb-1">🎓</div>
                <div className="text-[13px] font-semibold text-[#111008]">Soy graduado</div>
                <div className="text-[10px] text-[#9E9888] leading-tight mt-1">Busco fotógrafo</div>
                {role === 'client' && <span className="absolute top-2 right-2 text-[#B8923A] text-xs font-bold">✓</span>}
              </button>

              <button 
                type="button"
                onClick={() => setRole('vendor')}
                className={`p-3 rounded-lg border text-center transition-all relative ${role === 'vendor' ? 'border-[#B8923A] bg-[#FBF4E3] ring-2 ring-[#B8923A]/20' : 'border-[#B8923A]/20 bg-[#F5F1E8] hover:border-[#D4AE62]'}`}
              >
                <div className="text-2xl mb-1">📸</div>
                <div className="text-[13px] font-semibold text-[#111008]">Soy fotógrafo</div>
                <div className="text-[10px] text-[#9E9888] leading-tight mt-1">Ofrezco servicios</div>
                {role === 'vendor' && <span className="absolute top-2 right-2 text-[#B8923A] text-xs font-bold">✓</span>}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Nombre completo</label>
            <input name="fullName" type="text" required placeholder="Tu nombre" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Correo</label>
            <input name="email" type="email" required placeholder="tu@correo.com" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Contraseña</label>
            <input name="password" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]" />
          </div>

          {/* Campos extra si elige ser Fotógrafo */}
          {role === 'vendor' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Nombre de tu estudio</label>
                <input name="studioName" type="text" required={role === 'vendor'} placeholder="Ej: Foto Arte Sonora" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Ciudad donde operas</label>
                <select name="city" required={role === 'vendor'} className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]">
                  <option value="">Selecciona...</option>
                  <option value="Hermosillo">Hermosillo</option>
                  <option value="Obregón">Obregón</option>
                  <option value="Nogales">Nogales</option>
                  <option value="Guaymas">Guaymas</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-[#111008] text-[#FDFBF6] py-2.5 rounded-md text-[14px] font-medium hover:bg-[#2C2A22] transition-colors mt-2">
            Crear cuenta
          </button>
          
          <div className="text-center text-[12px] text-[#6B6558]">
            ¿Ya tienes cuenta? <Link href="/login" className="text-[#B8923A] hover:underline">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}