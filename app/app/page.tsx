import { cookies } from 'next/headers'
import HomeCards from './home-cards'
import { readSettings } from '@/lib/settings'
import { hasWebAuthnCredential } from './webauthn/actions'
import WebAuthnRegisterPrompt from './webauthn/register-prompt'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? ''
  const { manutenzione, rolePermissions } = await readSettings()
  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviAbilitato = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
  const hasCredential = username ? await hasWebAuthnCredential() : false
  return (
    <div style={{ marginLeft: 3, marginRight: 3, paddingBottom: 8 }}>
      {username && (
        <WebAuthnRegisterPrompt username={username} hasCredential={hasCredential} />
      )}
      <HomeCards loggedIn={!!username} manutenzione={manutenzione} preventiviAbilitato={preventiviAbilitato} />
      <p style={{ textAlign: 'center', marginTop: 24, paddingBottom: 8 }}>
        <a href="/app/privacy-policy" style={{ fontSize: 10, fontFamily: 'monospace', color: '#555', textDecoration: 'underline' }}>
          Privacy Policy &amp; Cookie Policy
        </a>
      </p>
    </div>
  )
}
