import RecuperoFormSito from './recupero-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Recupero credenziali' }

export default function Page() {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px 60px' }}>
      <RecuperoFormSito />
    </div>
  )
}
