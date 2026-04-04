'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions'

export default function LoginForm() {
  const [error, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        style={{
          padding: '4px 8px',
          fontSize: 13,
          border: '1px solid #ccc',
          borderRadius: 4,
          width: 110,
        }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        style={{
          padding: '4px 8px',
          fontSize: 13,
          border: '1px solid #ccc',
          borderRadius: 4,
          width: 110,
        }}
      />
      <button
        type="submit"
        disabled={isPending}
        className={isPending ? 'btn-gray' : 'btn-green'}
        style={{
          padding: '4px 12px',
          fontSize: 13,
          borderRadius: 4,
        }}
      >
        {isPending ? '...' : 'Entra'}
      </button>
      {error && (
        <span style={{ fontSize: 12, color: '#c00', whiteSpace: 'nowrap' }}>{error}</span>
      )}
    </form>
  )
}
