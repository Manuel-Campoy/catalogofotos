'use client'

import { useState } from 'react'
import { submitReview } from '@/app/estudio/[id]/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ReviewFormProps {
  vendorId: number;
  packages: { name: string }[];
  userRole?: string | null;
  userName?: string | null;
}

export default function ReviewForm({ vendorId, packages, userRole, userName }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!userRole) {
    return (
      <div className="bg-[#F5F1E8] border border-[#B8923A]/20 rounded-xl p-6 text-center">
        <h5 className="font-serif text-lg text-[#111008] mb-1">¿Tuviste una sesión aquí?</h5>
        <p className="text-xs text-[#6B6558] mb-4">Inicia sesión para compartir tu experiencia.</p>
        <Link href="/login" className="inline-block bg-[#111008] text-[#FDFBF6] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#2C2A22] transition-colors">
          Iniciar sesión para reseñar
        </Link>
      </div>
    )
  }

  if (userRole === 'vendor') {
    return (
      <div className="bg-[#F5F1E8] border border-[#B8923A]/20 rounded-xl p-6">
        <h5 className="font-serif text-lg text-[#111008] mb-1">Vista de fotógrafo</h5>
        <p className="text-xs text-[#6B6558]">Las reseñas solo pueden ser escritas por graduados (clientes).</p>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    formData.append('vendorId', vendorId.toString())
    formData.append('rating', rating.toString())

    const result = await submitReview(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setRating(0)
      const form = document.getElementById('review-form') as HTMLFormElement
      form.reset()
      setIsSubmitting(false)
      router.push(`?toast=review_added`, { scroll: false })
    }
  }

  return (
    <div className="bg-[#F5F1E8] border border-[#B8923A]/20 rounded-xl p-6">
      <h5 className="font-serif text-lg text-[#111008] mb-1">Deja tu reseña</h5>
      <p className="text-xs text-[#6B6558] mb-5">Tu opinión ayuda a otros graduados.</p>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form id="review-form" action={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Tu nombre</label>
            <input type="text" value={userName || 'Usuario'} readOnly className="w-full bg-white/50 border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none cursor-not-allowed opacity-70" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Paquete contratado</label>
            <select name="packageName" required className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A]">
              <option value="">Selecciona…</option>
              {packages.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Calificación</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl leading-none transition-all ${
                  star <= (hoverRating || rating) ? 'text-[#D4AE62] scale-110' : 'text-[#B8923A]/30'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Tu comentario</label>
          <textarea name="reviewText" required minLength={15} rows={3} placeholder="Cuéntanos cómo fue tu experiencia…" className="w-full bg-white border border-[#B8923A]/30 rounded-md px-3 py-2 text-[13px] text-[#111008] outline-none focus:border-[#B8923A] resize-y"></textarea>
        </div>

        <button disabled={isSubmitting} type="submit" className="self-start bg-[#111008] text-[#FDFBF6] px-6 py-2.5 rounded-md text-[13px] font-medium hover:bg-[#2C2A22] transition-colors mt-2 disabled:opacity-50">
          {isSubmitting ? 'Publicando...' : 'Publicar reseña'}
        </button>
      </form>
    </div>
  )
}