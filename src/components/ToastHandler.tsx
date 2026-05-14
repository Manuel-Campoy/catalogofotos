'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

function ToastLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [message, setMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toastType = searchParams.get('toast')
    const name = searchParams.get('name')
    const role = searchParams.get('role')

    if (toastType) {
      // Configuramos el mensaje según el tipo de acción
      if (toastType === 'logout') {
        setMessage('Has cerrado sesión.')
      } else if (toastType === 'login') {
        setMessage(`¡Bienvenido/a, ${name}! (${role})`)
      } else if (toastType === 'signup') {
        setMessage(`¡Cuenta creada! Bienvenido/a, ${name}. (${role})`)
      }

      // Mostramos el toast
      setIsVisible(true)

      // Limpiamos la URL sin recargar la página
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('toast')
      newSearchParams.delete('name')
      newSearchParams.delete('role')
      
      const newUrl = pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : '')
      router.replace(newUrl, { scroll: false })

      // Ocultamos el toast después de 3.5 segundos
      setTimeout(() => {
        setIsVisible(false)
      }, 3500)
    }
  }, [searchParams, pathname, router])

  if (!message) return null

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-[#111008] text-[#FDFBF6] px-6 py-3 rounded-full text-[14px] font-medium shadow-xl transition-all duration-300 pointer-events-none
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {message}
    </div>
  )
}

// Envolvemos en Suspense porque usamos useSearchParams en el Layout raíz
export default function ToastHandler() {
  return (
    <Suspense fallback={null}>
      <ToastLogic />
    </Suspense>
  )
}