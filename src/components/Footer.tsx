import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#2C2A22] px-8 py-9 border-t border-[#FDFBF6]/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-5 flex-wrap">
        <div className="font-serif text-[17px] font-bold text-[#FDFBF6]">
          Grad<span className="text-[#B8923A]">Lens</span> <span className="text-[11px] font-light text-[#FDFBF6]/30 font-sans tracking-wide">México</span>
        </div>
        <div className="flex gap-5">
          <Link href="#" className="text-[12px] text-[#FDFBF6]/40 hover:text-[#FDFBF6] transition-colors">Para fotógrafos</Link>
          <Link href="#" className="text-[12px] text-[#FDFBF6]/40 hover:text-[#FDFBF6] transition-colors">Privacidad</Link>
          <Link href="#" className="text-[12px] text-[#FDFBF6]/40 hover:text-[#FDFBF6] transition-colors">Contacto</Link>
          <Link href="#" className="text-[12px] text-[#FDFBF6]/40 hover:text-[#FDFBF6] transition-colors">Blog</Link>
        </div>
      </div>
      <div className="w-full text-center text-[11px] text-[#FDFBF6]/20 mt-5 pt-4 border-t border-[#FDFBF6]/5">
        © 2026 GradLens · Hermosillo, Sonora · Todos los derechos reservados
      </div>
    </footer>
  )
}