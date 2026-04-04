import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RgbPreview from './rgb-preview'

export default async function TestRgbPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  return (
    <>
      <h1 style={{ marginBottom: 8, fontSize: 22, fontWeight: 700 }}>Test Effetti RGB</h1>
      <p style={{ marginBottom: 24, fontSize: 13, color: '#666' }}>
        Scegli un colore con il picker o i cursori — le tre anteprime si aggiornano in tempo reale.
        Poi vai in Settings → sfondo header/pagina/footer e scegli RGB + imposta lo stesso colore.
      </p>
      <RgbPreview />
    </>
  )
}
