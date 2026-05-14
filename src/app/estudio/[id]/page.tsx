import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ReviewForm from '@/components/ReviewForm'

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
    userProfile = data;
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select(`
      *,
      packages (*),
      reviews (
        *,
        profiles (full_name)
      )
    `)
    .eq('id', id)
    .single()

  if (!vendor) notFound()

  const avgRating = vendor.reviews?.length > 0 
    ? (vendor.reviews.reduce((acc: number, rv: any) => acc + rv.rating, 0) / vendor.reviews.length).toFixed(1)
    : 'Nuevo';

  return (
    <div className="min-h-screen bg-[#FDFBF6] pb-20">
      {/* Hero del Estudio actualizado */}
      <section className="h-[400px] relative flex flex-col items-center justify-center text-white overflow-hidden">
        {vendor.cover_url ? (
          <img 
          src={vendor.cover_url} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Portada"
          />
        ) : (
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: vendor.bg_color || '#111008' }} />
        )}
  
  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
  
  <div className="relative z-10 text-center px-6">
    {vendor.logo_url && (
      <img src={vendor.logo_url} className="w-24 h-24 rounded-full border-2 border-[#D4AE62] mx-auto mb-4 object-cover shadow-2xl" alt="Logo" />
    )}
    <div className="text-[11px] tracking-[0.3em] uppercase text-[#D4AE62] mb-2 font-bold">
      {vendor.category} · {vendor.city}
    </div>
    <h1 className="font-serif text-4xl md:text-6xl font-bold drop-shadow-md">{vendor.name}</h1>
  </div>
</section>

      <div className="max-w-5xl mx-auto px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#B8923A]/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Columna Izquierda: Info y Paquetes */}
            <div className="md:col-span-2">
              <h2 className="text-[11px] tracking-widest uppercase text-[#9E9888] mb-4 border-b border-black/5 pb-2">
                Sobre el estudio
              </h2>
              <p className="text-[#6B6558] leading-relaxed mb-10 whitespace-pre-wrap">
                {vendor.description}
              </p>

              <h2 className="text-[11px] tracking-widest uppercase text-[#9E9888] mb-6 border-b border-black/5 pb-2">
                Paquetes disponibles
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {vendor.packages?.map((pkg: any) => (
                  <div key={pkg.id} className={`p-6 rounded-xl border ${pkg.is_highlighted ? 'border-[#B8923A] bg-[#FBF4E3]/30' : 'border-[#B8923A]/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] text-[#B8923A] font-bold uppercase">{pkg.tier}</span>
                        <h3 className="font-serif text-xl text-[#111008]">{pkg.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#111008]">MX${pkg.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {pkg.features?.map((f: string, i: number) => (
                        <li key={i} className="text-xs text-[#6B6558] flex gap-2">
                          <span className="text-[#B8923A]">›</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2.5 rounded-lg bg-[#111008] text-white text-sm font-medium hover:bg-[#2C2A22] transition-colors">
                      Reservar sesión
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Sidebar con Info y Reseñas */}
            <div className="space-y-8">
              <div className="p-6 bg-[#F5F1E8] rounded-xl border border-[#B8923A]/10">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#B8923A]/20">
                  <span className="text-xl text-[#D4AE62]">★</span>
                  <span className="font-bold text-[#111008]">{avgRating}</span>
                  <span className="text-xs text-[#6B6558]">({vendor.reviews?.length || 0} reseñas)</span>
                </div>
                <h3 className="text-sm font-bold text-[#111008] mb-3">Contacto Directo</h3>
                <div className="space-y-3 text-[13px] text-[#6B6558]">
                  <div className="flex items-center gap-2">📍 {vendor.city}</div>
                  <div className="flex items-center gap-2">📞 {vendor.contact_phone || 'No disponible'}</div>
                </div>
              </div>

              {/* Lista de Reseñas */}
              <div>
                <h3 className="text-[11px] tracking-widest uppercase text-[#9E9888] mb-4">Reseñas recientes</h3>
                {vendor.reviews?.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {vendor.reviews.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((rv: any) => (
                      <div key={rv.id} className="bg-[#FDFBF6] border border-[#B8923A]/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FBF4E3] text-[#B8923A] flex items-center justify-center text-[10px] font-bold border border-[#D4AE62]">
                              {rv.profiles?.full_name?.substring(0,2).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#111008] leading-tight">{rv.profiles?.full_name}</div>
                              <div className="text-[10px] text-[#9E9888]">Paquete {rv.package_name}</div>
                            </div>
                          </div>
                          <span className="text-[#D4AE62] text-[11px] tracking-widest">{'★'.repeat(rv.rating)}</span>
                        </div>
                        <p className="text-[12px] text-[#6B6558] italic mt-2 leading-relaxed">"{rv.review_text}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E9888] mb-8">Aún no hay reseñas para este estudio.</p>
                )}

                <ReviewForm 
                  vendorId={vendor.id} 
                  packages={vendor.packages || []} 
                  userRole={userProfile?.role}
                  userName={userProfile?.full_name}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}