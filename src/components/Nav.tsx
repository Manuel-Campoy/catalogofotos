import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user;

  let profile = null;

  if (user) {
    const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
    profile = data;
  }

  const getFirstName = (fullName: string) => fullName?.split(' ')[0] || 'Usuario';
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    return fullName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/?toast=logout')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] flex items-center bg-[#FDFBF6]/95 backdrop-blur-md border-b border-[#B8923A]/20">
      <div className="max-w-6xl mx-auto w-full px-8 flex items-center justify-between gap-6">
        
        <Link href="/" className="font-serif text-xl font-bold text-[#111008] flex items-baseline gap-1 shrink-0">
          Grad<span className="text-[#B8923A]">Lens</span>
          <span className="text-[10px] tracking-widest font-sans font-normal text-[#9E9888] uppercase mb-[2px]">Mx</span>
        </Link>

        {/* Lado Derecho */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          
          <Link href="#ideas" className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#111008] to-[#2a2210] text-[#D4AE62] border border-[#B8923A]/40 px-4 py-1.5 rounded-full text-xs font-medium shadow-[0_2px_10px_rgba(184,146,58,0.15)] hover:shadow-[0_4px_16px_rgba(184,146,58,0.25)] transition-all hover:-translate-y-[1px] mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AE62] animate-pulse"></span>
            ✦ Ideas de sesión
          </Link>

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="bg-transparent border border-[#B8923A]/35 text-[#111008] px-4 py-1.5 rounded-md text-[13px] hover:bg-[#F5F1E8] hover:border-[#B8923A] transition-all">
                Iniciar sesión
              </Link>
              {/* Botón de registrarse agregado */}
              <Link href="/registro" className="bg-[#111008] text-[#FDFBF6] px-[18px] py-1.5 rounded-md text-[13px] hover:bg-[#2C2A22] transition-colors">
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              
              {/* Botón de Mensajes */}
              <Link href="/mensajes" className="relative bg-transparent border border-[#B8923A]/30 text-[#6B6558] px-3 py-1.5 rounded-md text-[13px] hover:bg-[#F5F1E8] hover:border-[#B8923A] hover:text-[#111008] transition-all flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 3h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4l-3 2V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                Mensajes
              </Link>

              {profile && (
                <div className="flex items-center gap-2.5 mr-2 ml-1">
                  
                  {/* Botón exclusivo para fotógrafos */}
                  {profile.role === 'vendor' && (
                    <Link 
                      href="/dashboard" 
                      className="hidden sm:flex items-center gap-1.5 mr-1 bg-[#B8923A]/10 text-[#B8923A] border border-[#B8923A]/30 px-3 py-1.5 rounded-md text-[12px] font-bold hover:bg-[#B8923A] hover:text-white transition-all"
                    >
                      <span>⚙</span> Mi Panel
                    </Link>
                  )}

                  <div className="w-8 h-8 rounded-full bg-[#FBF4E3] border-[1.5px] border-[#D4AE62] flex items-center justify-center text-[#B8923A] text-xs font-bold">
                    {getInitials(profile.full_name)}
                  </div>
                  <span className="text-[14px] font-medium text-[#6B6558] hidden sm:block">
                    {getFirstName(profile.full_name)}
                  </span>
                  <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full font-bold hidden sm:block ${
                    profile.role === 'vendor' ? 'bg-[#EAE8E3] text-[#6B6558]' : 'bg-[#F5F1E8] text-[#B8923A]'
                  }`}>
                    {profile.role === 'vendor' ? 'FOTÓGRAFO' : 'GRADUADO'}
                  </span>
                </div>
              )}

              <form action={signOut}>
                <button className="bg-transparent border border-[#B8923A]/40 text-[#111008] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F5F1E8] hover:border-[#B8923A] transition-colors">
                  Salir
                </button>
              </form>

            </div>
          )}
        </div>
      </div>
    </nav>
  )
}