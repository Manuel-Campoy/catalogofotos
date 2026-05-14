'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function HeroSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (query) params.set('q', query)
    else params.delete('q')

    if (city) params.set('city', city)
    else params.delete('city')

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto flex bg-[#FDFBF6] rounded-md overflow-hidden shadow-2xl">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre del estudio..." 
        className="flex-1 border-none py-3.5 px-5 text-sm outline-none text-[#111008] bg-transparent" 
      />
      <select 
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border-none border-l border-[#B8923A]/20 px-3 text-[13px] text-[#6B6558] bg-[#F5F1E8] outline-none cursor-pointer hidden sm:block"
      >
        <option value="">Todas las ciudades</option>
        <option value="Hermosillo">Hermosillo</option>
        <option value="Obregón">Obregón</option>
        <option value="Nogales">Nogales</option>
        <option value="Guaymas">Guaymas</option>
      </select>
      <button type="submit" className="bg-[#B8923A] text-white px-6 text-sm font-medium hover:bg-[#D4AE62] transition-colors">
        Buscar
      </button>
    </form>
  )
}