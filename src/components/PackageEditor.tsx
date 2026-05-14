'use client'

import { addPackage, deletePackage } from '@/app/dashboard/actions'

export default function PackageEditor({ vendor }: { vendor: any }) {
  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-[#B8923A]/20">
      <div>
        <h2 className="font-serif text-2xl text-[#111008] mb-2">Tus Paquetes</h2>
        <p className="text-sm text-[#6B6558] mb-6">Agrega o elimina los paquetes que ofreces a los graduados.</p>
      </div>

      {/* Lista de paquetes actuales */}
      <div className="space-y-2">
        {vendor.packages?.length === 0 && (
          <p className="text-xs text-[#9E9888] italic">Aún no tienes paquetes registrados.</p>
        )}
        
        {vendor.packages?.map((pkg: any) => (
          <div key={pkg.id} className="flex justify-between items-center p-4 border border-[#B8923A]/20 bg-[#FDFBF6] rounded-lg mb-2">
            <div>
              <div className="text-sm font-bold text-[#111008]">{pkg.name}</div>
              <div className="text-xs text-[#6B6558]">{pkg.tier} • MX${pkg.price}</div>
              <div className="text-[10px] text-[#9E9888] mt-1 line-clamp-1">{pkg.features?.join(', ')}</div>
            </div>
            <button 
              onClick={() => deletePackage(pkg.id, vendor.id)}
              className="text-red-400 hover:text-red-600 text-[11px] font-medium px-3 py-1 border border-red-100 bg-red-50 rounded-md transition-colors shrink-0"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Formulario para agregar un paquete nuevo */}
      <form action={addPackage} className="bg-white p-6 rounded-xl border border-[#B8923A]/20 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111008] mb-4">Agregar nuevo paquete</h3>
        <input type="hidden" name="vendorId" value={vendor.id} />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Nombre del paquete</label>
            <input name="name" required placeholder="Ej. Sesión Básica" className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Precio (MX$)</label>
            <input name="price" type="number" required placeholder="Ej. 1500" className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Categoría</label>
            <select name="tier" required className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]">
              <option value="Básico">Básico</option>
              <option value="Estándar">Estándar</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium tracking-wide text-[#6B6558] uppercase">Características (separadas por coma)</label>
            <input name="features" required placeholder="Ej. 1 hora, 15 fotos, locación exterior" className="w-full bg-[#FDFBF6] border border-[#B8923A]/20 rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#B8923A]" />
          </div>
        </div>

        <button type="submit" className="w-full bg-transparent border border-[#B8923A] text-[#B8923A] py-2.5 rounded-lg text-sm font-medium hover:bg-[#B8923A] hover:text-white transition-colors mt-2">
          + Guardar Paquete
        </button>
      </form>
    </div>
  )
}