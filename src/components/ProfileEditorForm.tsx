'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { updateVendorProfile } from '@/app/dashboard/actions'

export default function ProfileEditorForm({ vendor }: { vendor: any }) {
  const [logoUrl, setLogoUrl] = useState(vendor.logo_url)
  const [coverUrl, setCoverUrl] = useState(vendor.cover_url)

  return (
    <form action={updateVendorProfile} className="space-y-6">
      <input type="hidden" name="logo_url" value={logoUrl || ''} />
      <input type="hidden" name="cover_url" value={coverUrl || ''} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ImageUploader label="Logo del estudio" folder="logos" currentUrl={logoUrl} onUpload={setLogoUrl} />
        <ImageUploader label="Imagen de portada" folder="covers" currentUrl={coverUrl} onUpload={setCoverUrl} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Nombre del estudio</label>
        <input name="name" defaultValue={vendor.name} className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Descripción larga</label>
        <textarea name="description" rows={4} defaultValue={vendor.description} className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Ciudad</label>
          <input name="city" defaultValue={vendor.city} className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Teléfono de contacto</label>
          <input name="phone" defaultValue={vendor.contact_phone} className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
        </div>
      </div>

      <button type="submit" className="w-full bg-[#111008] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2C2A22] transition-colors shadow-lg">
        Guardar cambios
      </button>
    </form>
  )
}