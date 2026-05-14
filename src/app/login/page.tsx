import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-[#B8923A]/20">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold text-[#111008]">
            Grad<span className="text-[#B8923A]">Lens</span>
          </Link>
          <p className="text-[13px] text-[#6B6558] mt-2">Accede para reservar y dejar reseñas</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Correo</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="tu@correo.com"
              className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium tracking-wide text-[#6B6558] uppercase">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button formAction={login} className="w-full bg-[#111008] text-[#FDFBF6] py-2.5 rounded-md text-[14px] font-medium hover:bg-[#2C2A22] transition-colors">
              Iniciar sesión
            </button>
            <button formAction={signup} className="w-full bg-transparent border border-[#B8923A]/30 text-[#111008] py-2.5 rounded-md text-[14px] font-medium hover:bg-[#F5F1E8] transition-colors">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}