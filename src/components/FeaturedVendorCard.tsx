import Link from 'next/link'

export default function FeaturedVendorCard({ vendor }: { vendor: any }) {
  const packageCount = vendor.packages?.length || 0;
  const minPrice = packageCount > 0 ? Math.min(...vendor.packages.map((p: any) => p.price)) : vendor.start_price;

  return (
    <Link 
      href={`/estudio/${vendor.id}`}
      className="rounded-[10px] overflow-hidden relative cursor-pointer min-h-[290px] flex flex-col justify-end transition-transform duration-250 hover:-translate-y-1 border border-white/5 group"
    >
      {/* Portada Real */}
      {vendor.cover_url ? (
        <img 
          src={vendor.cover_url} 
          alt={vendor.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div 
          className="absolute inset-0 flex items-center justify-center text-[88px] opacity-20"
          style={{ backgroundColor: vendor.bg_color || '#111008' }}
        >
          {vendor.emoji}
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#111008]/90 via-[#111008]/40 to-transparent" />
      
      {vendor.is_verified && (
        <div className="absolute top-3.5 left-3.5 bg-[#B8923A] text-white text-[10px] tracking-[0.1em] uppercase px-3 py-1 rounded-full font-medium z-10">
          ✓ Verificado
        </div>
      )}
      
      <div className="relative p-5 z-10">
        <div className="text-[10px] tracking-[0.14em] uppercase text-[#D4AE62] mb-1.5">
          {vendor.category}
        </div>
        <div className="font-serif text-[22px] font-medium text-[#FDFBF6] mb-1.5">
          {vendor.name}
        </div>
        <div className="text-[13px] text-[#FDFBF6]/55 mb-3 leading-relaxed line-clamp-2">
          {vendor.description}
        </div>
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="text-[13px] text-[#FDFBF6]/65 flex items-center gap-1">
            <span className="text-[#D4AE62] text-[12px]">★★★★★</span> 5.0
          </span>
          <span className="text-[13px] text-[#D4AE62] font-medium">
            Desde MX${minPrice?.toLocaleString()}
          </span>
          <span className="text-[12px] text-[#FDFBF6]/40">
            📍 {vendor.city}
          </span>
        </div>
      </div>
    </Link>
  )
}