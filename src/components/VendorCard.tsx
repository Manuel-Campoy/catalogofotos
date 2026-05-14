import Link from 'next/link'

export default function VendorCard({ vendor }: { vendor: any }) {
  const packageCount = vendor.packages?.length || 0;
  const minPrice = packageCount > 0 
    ? Math.min(...vendor.packages.map((p: any) => p.price))
    : vendor.start_price;

  return (
    <Link 
      href={`/estudio/${vendor.id}`}
      className="bg-white border border-[#B8923A]/20 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
    >
      <div className="h-44 flex items-center justify-center relative shrink-0 overflow-hidden">
        {/* Imagen de fondo (Logo o color sólido) */}
        {vendor.logo_url ? (
          <img 
            src={vendor.logo_url} 
            alt={vendor.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: vendor.bg_color || '#1A1612' }}
          >
            {vendor.emoji || '📸'}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        
        {vendor.is_verified && (
          <div className="absolute top-3 right-3 bg-[#FDFBF6]/90 backdrop-blur-sm border border-[#B8923A]/30 rounded-full text-[9px] font-bold text-[#B8923A] px-2.5 py-1 uppercase tracking-wider z-10">
            ✓ Verificado
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] tracking-widest uppercase text-[#B8923A] mb-1">
          {vendor.category}
        </div>
        <h3 className="font-serif text-lg font-medium text-[#111008] mb-1">
          {vendor.name}
        </h3>
        <p className="text-xs text-[#6B6558] mb-3 line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>
        <div className="text-[11px] text-[#9E9888] mb-auto pb-3">
          📍 {vendor.city}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
          <div className="flex items-center gap-1 text-xs text-[#6B6558]">
            <span className="text-[#D4AE62]">★</span> 
            <span>Nuevo</span>
          </div>
          
          <div className="text-right">
            <div className="text-[13px] font-semibold text-[#111008]">
              MX${minPrice?.toLocaleString()} <span className="font-normal text-[#9E9888] text-[11px]">desde</span>
            </div>
            <div className="text-[11px] text-[#9E9888] mt-0.5">
              {packageCount} paquete{packageCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}