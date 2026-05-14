import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileEditorForm from '@/components/ProfileEditorForm'
import PackageEditor from '@/components/PackageEditor'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams;
  const currentTab = params.tab || 'perfil'; 

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'vendor') {
    redirect('/') 
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('*, packages(*)')
    .eq('profile_id', user.id)
    .single()

  if (!vendor) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center bg-[#FDFBF6] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-[#B8923A]/20 text-center max-w-lg w-full">
          <div className="text-5xl mb-4">📸</div>
          <h1 className="font-serif text-2xl text-[#111008] mb-2">Configuración pendiente</h1>
          <p className="text-[13px] text-[#6B6558] mb-6">Tu cuenta de fotógrafo está activa, pero aún no tienes un estudio publicado en el directorio.</p>
          <button className="bg-[#111008] text-white px-6 py-2.5 rounded-md text-[13px] font-medium hover:bg-[#2C2A22] transition-colors">
            Crear mi estudio
          </button>
        </div>
      </div>
    )
  }

  const btnBase = "block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  const btnActive = "bg-[#111008] text-white"
  const btnInactive = "text-[#6B6558] hover:bg-[#F5F1E8]"

  return (
    <div className="min-h-screen bg-[#FDFBF6] py-12">
      <div className="max-w-4xl mx-auto px-8">
        <header className="mb-10">
          <h1 className="font-serif text-3xl text-[#111008] mb-2">Panel de Control</h1>
          <p className="text-sm text-[#6B6558]">Gestiona tu perfil público, imágenes y paquetes.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* BARRA LATERAL (TABS) */}
          <aside className="space-y-1">
            <Link 
              href="/dashboard?tab=perfil" 
              className={`${btnBase} ${currentTab === 'perfil' ? btnActive : btnInactive}`}
            >
              Perfil del estudio
            </Link>
            <Link 
              href="/dashboard?tab=paquetes" 
              className={`${btnBase} ${currentTab === 'paquetes' ? btnActive : btnInactive}`}
            >
              Paquetes
            </Link>
            <button className={`${btnBase} opacity-50 cursor-not-allowed`} title="Próximamente">
              Estadísticas (Pronto)
            </button>
          </aside>

          {/* CONTENIDO DINÁMICO */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-[#B8923A]/20 shadow-sm">
            {currentTab === 'perfil' && <ProfileEditorForm vendor={vendor} />}
            {currentTab === 'paquetes' && <PackageEditor vendor={vendor} />}
          </div>
          
        </div>
      </div>
    </div>
  )
}