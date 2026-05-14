import { createClient } from '@/utils/supabase/server'
import VendorCard from '@/components/VendorCard'
import FeaturedVendorCard from '@/components/FeaturedVendorCard'
import IdeasBoard from '@/components/IdeasBoard'
import HeroSearch from '@/components/HeroSearch'
import FilterBar from '@/components/FilterBar'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const q = params.q || '';
  const city = params.city || '';
  const category = params.category || '';
  const sort = params.sort || '';

  const supabase = await createClient()
  
  let query = supabase.from('vendors').select(`*, packages (price)`)

  if (q) query = query.ilike('name', `%${q}%`)
  if (city) query = query.eq('city', city)
  if (category === 'Estudio') query = query.ilike('category', `%Estudio%`)
  if (category === 'Freelance') query = query.ilike('category', `%Freelance%`)

  const { data: vendors, error } = await query

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>
  }

  let processedVendors = vendors?.map(v => {
    const packageCount = v.packages?.length || 0;
    const minPrice = packageCount > 0 ? Math.min(...v.packages.map((p: any) => p.price)) : (v.start_price || 0);
    return { ...v, minPrice };
  }) || [];

  if (category === 'Premium') {
    processedVendors = processedVendors.filter(v => v.minPrice >= 4000);
  } else if (category === 'Económico') {
    processedVendors = processedVendors.filter(v => v.minPrice < 2500);
  }

  if (sort === 'price_asc') {
    processedVendors.sort((a, b) => a.minPrice - b.minPrice);
  } else if (sort === 'price_desc') {
    processedVendors.sort((a, b) => b.minPrice - a.minPrice);
  }

  const isFiltering = q || city || category !== '' || sort !== '';
  const featuredVendors = isFiltering ? [] : processedVendors.filter(v => v.is_featured);

  return (
    <main className="min-h-screen">
      
      <section className="bg-[#111008] px-8 pt-16 pb-14 relative overflow-hidden text-center bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(184,146,58,0.14),transparent_65%)]">
        <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[#D4AE62] mb-5">
          <span className="w-6 h-px bg-[#B8923A]"></span>
          Directorio verificado · Sonora 2026
          <span className="w-6 h-px bg-[#B8923A]"></span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-[#FDFBF6] leading-tight mb-4">
          Encuentra al fotógrafo<br />perfecto para tu <em className="italic text-[#D4AE62]">graduación</em>
        </h1>
        <p className="text-[15px] text-[#FDFBF6]/50 max-w-lg mx-auto mb-8">
          Compara estudios, lee reseñas reales y reserva con total confianza.
        </p>
        
        <HeroSearch />

        <div className="flex justify-center gap-8 md:gap-12 mt-10 pt-8 border-t border-[#FDFBF6]/10 flex-wrap">
          <div><div className="font-serif text-2xl text-[#D4AE62]">38</div><div className="text-xs text-[#FDFBF6]/40 mt-1">Estudios verificados</div></div>
          <div><div className="font-serif text-2xl text-[#D4AE62]">4.8★</div><div className="text-xs text-[#FDFBF6]/40 mt-1">Calificación promedio</div></div>
          <div><div className="font-serif text-2xl text-[#D4AE62]">5,000+</div><div className="text-xs text-[#FDFBF6]/40 mt-1">Graduados felices</div></div>
          <div><div className="font-serif text-2xl text-[#D4AE62]">Gratis</div><div className="text-xs text-[#FDFBF6]/40 mt-1">Sin comisión para ti</div></div>
        </div>
      </section>

      <FilterBar resultsCount={processedVendors.length} />

      <div className="max-w-6xl mx-auto px-8 pt-12 pb-20">
        
        {featuredVendors.length > 0 && (
          <div className="mb-14">
            <span className="text-[11px] tracking-[0.14em] uppercase text-[#B8923A] mb-2 block">Destacados</span>
            <h2 className="font-serif text-[28px] text-[#111008] mb-5">Estudios recomendados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredVendors.map((vendor) => (
                <FeaturedVendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <span className="text-[11px] tracking-[0.14em] uppercase text-[#B8923A] mb-2 block">
            {isFiltering ? 'Resultados de búsqueda' : 'Directorio completo'}
          </span>
          <h2 className="font-serif text-[28px] text-[#111008]">
            {isFiltering ? `${processedVendors.length} estudios encontrados` : 'Todos los proveedores'}
          </h2>
        </div>
        
        {processedVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {processedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-[#B8923A]/30 rounded-xl bg-white">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-serif text-[#111008] mb-1">No encontramos resultados</h3>
            <p className="text-sm text-[#6B6558]">Intenta ajustando tus filtros o buscando en otra ciudad.</p>
          </div>
        )}
      </div>

      <IdeasBoard />

      <section className="bg-[#111008] py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[#D4AE62] mb-3">
            <span className="w-4 h-px bg-[#B8923A]"></span> Proceso simple <span className="w-4 h-px bg-[#B8923A]"></span>
          </div>
          <h2 className="font-serif text-3xl text-[#FDFBF6] mb-1.5">¿Cómo funciona GradLens?</h2>
          <p className="text-sm text-[#FDFBF6]/45 mb-10">Conectamos graduados con los mejores fotógrafos de Sonora</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-[#B8923A]/30 flex items-center justify-center text-xl mx-auto mb-3">🔍</div>
              <div className="text-[10px] tracking-[0.12em] uppercase text-[#D4AE62] mb-1">Paso 1</div>
              <div className="text-sm text-[#FDFBF6] font-medium mb-1">Explora</div>
              <div className="text-xs text-[#FDFBF6]/40 leading-relaxed">Compara estudios, portafolios y paquetes fácilmente</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-[#B8923A]/30 flex items-center justify-center text-xl mx-auto mb-3">⭐</div>
              <div className="text-[10px] tracking-[0.12em] uppercase text-[#D4AE62] mb-1">Paso 2</div>
              <div className="text-sm text-[#FDFBF6] font-medium mb-1">Lee reseñas</div>
              <div className="text-xs text-[#FDFBF6]/40 leading-relaxed">Opiniones verificadas de graduados como tú</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-[#B8923A]/30 flex items-center justify-center text-xl mx-auto mb-3">📅</div>
              <div className="text-[10px] tracking-[0.12em] uppercase text-[#D4AE62] mb-1">Paso 3</div>
              <div className="text-sm text-[#FDFBF6] font-medium mb-1">Reserva</div>
              <div className="text-xs text-[#FDFBF6]/40 leading-relaxed">Contacta directo al proveedor y agenda tu sesión</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-[#B8923A]/30 flex items-center justify-center text-xl mx-auto mb-3">📸</div>
              <div className="text-[10px] tracking-[0.12em] uppercase text-[#D4AE62] mb-1">Paso 4</div>
              <div className="text-sm text-[#FDFBF6] font-medium mb-1">¡Disfruta!</div>
              <div className="text-xs text-[#FDFBF6]/40 leading-relaxed">Vive tu sesión y recibe fotos increíbles</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}