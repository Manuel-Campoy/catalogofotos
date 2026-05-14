import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { sendMessage } from './actions'

export default async function MensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string, idea?: string }>
}) {
  const params = await searchParams
  const activeChatId = params.to
  const ideaContextId = params.idea

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=Debes+iniciar+sesión+para+ver+tus+mensajes')

  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name, role),
      receiver:profiles!messages_receiver_id_fkey(full_name, role)
    `)
    .order('created_at', { ascending: true })

  const contactsMap = new Map()
  messages?.forEach((msg) => {
    const isSender = msg.sender_id === user.id
    const contactId = isSender ? msg.receiver_id : msg.sender_id
    const contactInfo = isSender ? msg.receiver : msg.sender

    if (!contactsMap.has(contactId)) {
      contactsMap.set(contactId, { id: contactId, info: contactInfo, lastMessage: msg.content })
    } else {
      contactsMap.get(contactId).lastMessage = msg.content
    }
  })
  
  const contacts = Array.from(contactsMap.values())

  const activeMessages = messages?.filter(
    (msg) => (msg.sender_id === user.id && msg.receiver_id === activeChatId) || 
             (msg.receiver_id === user.id && msg.sender_id === activeChatId)
  )

  let activeContactInfo = contactsMap.get(activeChatId)?.info
  if (activeChatId && !activeContactInfo) {
    const { data: newContact } = await supabase.from('profiles').select('full_name, role').eq('id', activeChatId).single()
    activeContactInfo = newContact
  }

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U'

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#FDFBF6] flex">
      
      {/* PANEL IZQUIERDO: Lista de Contactos */}
      <div className="w-full md:w-[320px] bg-white border-r border-[#B8923A]/20 flex flex-col h-[calc(100vh-60px)] sticky top-[60px]">
        <div className="p-5 border-b border-[#B8923A]/10">
          <h1 className="font-serif text-xl font-bold text-[#111008]">Mensajes</h1>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {contacts.length === 0 && !activeChatId && (
            <p className="text-xs text-center text-[#9E9888] mt-10">Bandeja de entrada vacía.</p>
          )}
          
          {contacts.map((contact) => (
            <Link 
              key={contact.id} 
              href={`/mensajes?to=${contact.id}`}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeChatId === contact.id ? 'bg-[#F5F1E8] border border-[#B8923A]/20' : 'hover:bg-[#FDFBF6] border border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#FBF4E3] border border-[#D4AE62] flex items-center justify-center text-[#B8923A] text-sm font-bold shrink-0">
                {getInitials(contact.info?.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#111008] truncate">{contact.info?.full_name}</div>
                <div className="text-[11px] text-[#6B6558] truncate">{contact.lastMessage}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO: Chat Activo */}
      <div className={`${activeChatId ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-[calc(100vh-60px)] bg-[#F5F1E8]/50 absolute md:static w-full z-10`}>
        {activeChatId ? (
          <>
            {/* Cabecera del Chat */}
            <div className="h-[70px] bg-white border-b border-[#B8923A]/20 flex items-center px-6 gap-3 shrink-0">
              <Link href="/mensajes" className="md:hidden text-[#9E9888] hover:text-[#111008] mr-2">← Volver</Link>
              <div className="w-10 h-10 rounded-full bg-[#FBF4E3] border border-[#D4AE62] flex items-center justify-center text-[#B8923A] text-sm font-bold shrink-0">
                {getInitials(activeContactInfo?.full_name)}
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#111008]">{activeContactInfo?.full_name}</div>
                <div className="text-[10px] text-[#9E9888] uppercase tracking-wider">{activeContactInfo?.role === 'vendor' ? 'Fotógrafo' : 'Graduado'}</div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-sm text-[#6B6558]">Este es el inicio de tu conversación.</p>
                  {ideaContextId && <p className="text-xs mt-1 text-[#B8923A]">¡Escríbele para platicar sobre la idea de su sesión!</p>}
                </div>
              ) : (
                activeMessages?.map((msg) => {
                  const isMe = msg.sender_id === user.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[13px] ${isMe ? 'bg-[#111008] text-[#FDFBF6] rounded-br-sm' : 'bg-white border border-[#B8923A]/20 text-[#111008] rounded-bl-sm shadow-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input para enviar */}
            <div className="p-4 bg-white border-t border-[#B8923A]/20">
              <form action={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                <input type="hidden" name="receiverId" value={activeChatId} />
                {ideaContextId && <input type="hidden" name="ideaId" value={ideaContextId} />}
                <input 
                  type="text" 
                  name="content" 
                  required
                  autoComplete="off"
                  placeholder="Escribe tu mensaje..." 
                  className="flex-1 bg-[#F5F1E8] border border-[#B8923A]/20 rounded-full px-5 py-3 text-[13px] outline-none focus:border-[#B8923A] transition-colors"
                />
                <button type="submit" className="bg-[#B8923A] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#D4AE62] transition-colors shrink-0 shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 hidden md:flex">
            <div className="text-6xl mb-4 text-[#B8923A]">💬</div>
            <h3 className="font-serif text-2xl text-[#111008] mb-2">Tus mensajes</h3>
            <p className="text-sm text-[#6B6558]">Selecciona una conversación del panel izquierdo.</p>
          </div>
        )}
      </div>

    </div>
  )
}