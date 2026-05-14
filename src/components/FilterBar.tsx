'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterBar({ resultsCount }: { resultsCount: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get('category') || 'Todos'
  const currentSort = searchParams.get('sort') || ''

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'Todos') params.delete('category')
    else params.set('category', category)
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sort) params.set('sort', sort)
    else params.delete('sort')
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const btnBase = "shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium transition-all"
  const btnActive = "bg-[#111008] text-white border-[#111008]"
  const btnInactive = "border-[#B8923A]/20 text-[#6B6558] hover:border-[#B8923A] hover:bg-[#FDFBF6]"

  return (
    <div className="bg-white border-b border-[#B8923A]/20 sticky top-[60px] z-40">
      <div className="max-w-6xl mx-auto px-8 flex items-center gap-2.5 h-[52px] overflow-x-auto scrollbar-hide">
        
        {['Todos', 'Estudio', 'Freelance', 'Premium', 'Económico'].map(cat => (
          <button 
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`${btnBase} ${currentCategory === cat ? btnActive : btnInactive}`}
          >
            {cat}
          </button>
        ))}

        <div className="w-[1px] h-5 bg-[#B8923A]/20 shrink-0 mx-2"></div>
        
        <select 
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="bg-transparent border-none text-xs text-[#6B6558] outline-none cursor-pointer"
        >
          <option value="">Orden predeterminado</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
        </select>

        <span className="text-xs text-[#9E9888] ml-auto shrink-0">{resultsCount} proveedores</span>
      </div>
    </div>
  )
}