import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function IdeasBoard() {
  const supabase = await createClient()
  
  const { data: ideas } = await supabase
    .from('ideas')
    .select(`
      *,
      profiles (full_name)
    `)
    .order('created_at', { ascending: false })

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  return (
    <section id="ideas" className="bg-gradient-to-br from-[#0e0c07] via-[#1a1508] to-[#0e0c07] py-20 px-8 relative overflow-hidden">
      <div className="absolute right-[5%] top-[10%] text-9xl opacity-5 text-[#B8923A] pointer-events-none">✦</div>
      <div className="absolute left-[3%] bottom-[8%] text-7xl opacity-5 text-[#B8923A] pointer-events-none">✦</div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-[11px] tracking-[0.16em] uppercase text-[#D4AE62] mb-3 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#B8923A]"></span>
              Tablero de inspiración
              <span className="w-6 h-[1px] bg-[#B8923A]"></span>
            </div>
            <h2 className="font-serif text-3xl text-[#FDFBF6]">
              Ideas de <em className="italic text-[#D4AE62]">sesiones</em> de graduados
            </h2>
            <p className="text-[13px] text-[#FDFBF6]/40 mt-1.5">
              Los graduados comparten su visión — los fotógrafos los contactan para hacerla realidad
            </p>
          </div>
          
          <Link 
            href="/ideas/nueva" 
            className="inline-flex items-center justify-center bg-gradient-to-br from-[#B8923A] to-[#8a6820] text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold shadow-[0_4px_16px_rgba(184,146,58,0.3)] hover:shadow-[0_6px_24px_rgba(184,146,58,0.4)] hover:-translate-y-[1px] transition-all whitespace-nowrap"
          >
            ✦ Publicar mi idea
          </Link>
        </div>

        {ideas && ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-[#FDFBF6]/5 border border-[#B8923A]/20 rounded-xl p-5 hover:bg-[#FDFBF6]/10 hover:border-[#B8923A]/40 hover:-translate-y-1 transition-all flex flex-col h-full">
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {idea.tags?.map((tag: string, i: number) => (
                    <span key={i} className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#B8923A]/10 text-[#D4AE62] font-medium border border-[#B8923A]/20">
                      {tag}
                    </span>
                  ))}
                  {idea.city && (
                    <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-white/50 font-medium">
                      📍 {idea.city}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-[17px] font-medium text-[#FDFBF6] mb-2">
                  {idea.title}
                </h3>
                <p className="text-[13px] text-[#FDFBF6]/50 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {idea.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#B8923A]/10 mt-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#B8923A]/20 flex items-center justify-center text-[10px] font-bold text-[#D4AE62] shrink-0 border border-[#B8923A]/30">
                      {getInitials(idea.profiles?.full_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] text-[#FDFBF6]/60 truncate">
                        {idea.profiles?.full_name?.split(' ')[0] || 'Usuario'}
                      </div>
                      {idea.budget && (
                        <div className="text-[11px] text-[#D4AE62] font-medium">
                          {idea.budget}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón Contactar */}
                  <Link 
                    href={`/mensajes?to=${idea.profile_id}&idea=${idea.id}`}
                    className="bg-[#B8923A]/10 text-[#D4AE62] border border-[#B8923A]/30 px-3.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[#B8923A] hover:text-white transition-all shrink-0 text-center"
                  >
                    Contactar
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#FDFBF6]/30">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm">Aún no hay ideas publicadas. ¡Sé el primero en compartir tu visión!</p>
          </div>
        )}
      </div>
    </section>
  )
}