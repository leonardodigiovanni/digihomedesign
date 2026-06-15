import RecuperoForm from './recupero-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Recupero credenziali' }

export default function Page() {
  return (
    <div style={{ marginLeft: 3, marginRight: 3, paddingBottom: 80 }}>
      <RecuperoForm />
    </div>
  )
}
