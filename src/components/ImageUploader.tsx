'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ImageUploader({ 
  label, 
  currentUrl, 
  onUpload, 
  folder 
}: { 
  label: string, 
  currentUrl?: string, 
  onUpload: (url: string) => void,
  folder: string
}) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('vendor-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('vendor-assets')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error) {
      alert('Error subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && (
          <img src={currentUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-[#B8923A]/20" />
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading}
          className="text-xs text-[#6B6558] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#F5F1E8] file:text-[#111008] hover:file:bg-[#EAE8E3] cursor-pointer"
        />
      </div>
    </div>
  )
}