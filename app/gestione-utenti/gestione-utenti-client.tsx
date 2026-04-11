'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { changeUserRole, toggleUserActive, toggleCantieriCliente, toggleOrdiniCliente, changePassword, type ChangeRoleResult, type ToggleActiveResult, type ToggleCantieriResult, type ToggleOrdiniResult, type ChangePasswordResult } from './actions'

type User = {
  username: string
  nome: string
  cognome: string
  email: string
  cellulare: string
  role: string
  is_active: number
  cantieri_visibili: number
  miei_ordini_visibili: number
  password: string
}

const ALL_ASSIGNABLE_ROLES = [
  'admin',
  'cliente',
  'dipendente',
  'ragioniere',
  'commercialista',
  'venditore',
  'operaio',
  'magazzino',
  'direttore',
  'marketing',
  'email',
]

const ROLE_LABELS: Record<string, string> = {
  admin:          'Admin',
  cliente:        'Cliente',
  dipendente:     'Dipendente',
  ragioniere:     'Ragioniere',
  commercialista: 'Commercialista',
  venditore:      'Venditore',
  operaio:        'Operaio',
  magazzino:      'Magazzino',
  direttore:      'Direttore',
  marketing:      'Marketing',
  email:          'Email',
}

const ROLE_COLORS: Record<string, string> = {
  admin:          '#1a1a1a',
  cliente:        '#4a8fa8',
  dipendente:     '#6b8f71',
  ragioniere:     '#7b6fa0',
  commercialista: '#c47c5a',
  venditore:      '#4f7cac',
  operaio:        '#8f7b6b',
  magazzino:      '#5a8a6b',
  direttore:      '#a07b5a',
  marketing:      '#8a6b8f',
  email:          '#6b7ba0',
}

function PasswordCell({ user }: { user: User }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(user.password)
  const [result, action, pending] = useActionState<ChangePasswordResult | null, FormData>(changePassword, null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); setEditing(false) }
  }, [result])

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#444', background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>
          {user.password}
        </span>
        <button onClick={() => setEditing(true)}
          style={{ background: 'none', border: '1px solid #ccc', borderRadius: 4, padding: '2px 7px', fontSize: 12, cursor: 'pointer', color: '#666' }}>
          ✎
        </button>
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input type="hidden" name="username" value={user.username} />
      <input name="password" type="text" value={val} onChange={e => setVal(e.target.value)}
        autoFocus required minLength={4}
        style={{ width: 130, padding: '4px 8px', fontSize: 13, border: '1px solid #4a8fa8', borderRadius: 4, fontFamily: 'monospace' }} />
      <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : '✓'}
      </button>
      <button type="button" onClick={() => { setEditing(false); setVal(user.password) }}
        style={{ background: 'none', border: '1px solid #ccc', borderRadius: 4, padding: '3px 7px', fontSize: 12, cursor: 'pointer', color: '#888' }}>
        ✕
      </button>
      {result && !result.ok && <span style={{ fontSize: 11, color: '#c00' }}>{result.error}</span>}
    </form>
  )
}

type SortCol = 'username' | 'nome' | 'email' | 'role' | 'is_active'

function RoleRow({ user, isSelf, hasClienti }: { user: User; isSelf: boolean; hasClienti: boolean }) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState(user.role)
  const dirty = selectedRole !== user.role
  const [roleResult, roleAction, rolePending] = useActionState<ChangeRoleResult | null, FormData>(changeUserRole, null)
  const [toggleResult, toggleAction, togglePending] = useActionState<ToggleActiveResult | null, FormData>(toggleUserActive, null)
  const [cantieriResult, cantieriAction, cantieriPending] = useActionState<ToggleCantieriResult | null, FormData>(toggleCantieriCliente, null)
  const [ordiniResult, ordiniAction, ordiniPending]       = useActionState<ToggleOrdiniResult | null, FormData>(toggleOrdiniCliente, null)

  useEffect(() => {
    if (roleResult?.ok || toggleResult?.ok || cantieriResult?.ok || ordiniResult?.ok) router.refresh()
  }, [roleResult, toggleResult, cantieriResult, ordiniResult])

  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    background: ROLE_COLORS[user.role] ?? '#888',
  }

  const activeBadge: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    background: user.is_active ? '#4a8f6b' : '#c00',
  }

  const inactive = !user.is_active

  return (
    <tr style={{ borderBottom: '1px solid #f0f0f0', background: inactive ? '#fff5f5' : '#fff' }}>
      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', borderLeft: inactive ? '3px solid #c00' : '3px solid transparent' }}>
        {user.username}
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#444' }}>
        {user.nome} {user.cognome}
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#888' }}>
        {user.email}
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, whiteSpace: 'nowrap' }}>
        {user.cellulare
          ? <a href={`tel:${user.cellulare}`} style={{ color: '#4a8fa8', textDecoration: 'none', fontWeight: 500 }}>{user.cellulare}</a>
          : <span style={{ color: '#ccc' }}>—</span>
        }
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={badgeStyle}>{ROLE_LABELS[user.role] ?? user.role}</span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <form action={toggleAction} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="hidden" name="username" value={user.username} />
          <span style={activeBadge}>{user.is_active ? 'Attivo' : 'Inattivo'}</span>
          {!isSelf && (
          <button
            type="submit"
            disabled={togglePending}
            className={togglePending ? 'btn-gray' : user.is_active ? 'btn-red' : 'btn-green'}
            style={{ padding: '4px 10px', fontSize: 12, borderRadius: 5, fontFamily: 'inherit' }}
          >
            {togglePending ? '...' : user.is_active ? 'Disattiva' : 'Attiva'}
          </button>
          )}
          {toggleResult && !toggleResult.ok && (
            <span style={{ fontSize: 12, color: '#c00' }}>{toggleResult.error}</span>
          )}
        </form>
      </td>
      {hasClienti && (
        <td style={{ padding: '10px 12px' }}>
          {user.role === 'cliente' ? (
            <form action={cantieriAction} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="hidden" name="username" value={user.username} />
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                fontSize: 11, fontWeight: 600, color: '#fff',
                background: user.cantieri_visibili ? '#4a8f6b' : '#888',
              }}>
                {user.cantieri_visibili ? 'Visibile' : 'Nascosto'}
              </span>
              <button
                type="submit"
                disabled={cantieriPending}
                className={cantieriPending ? 'btn-gray' : user.cantieri_visibili ? 'btn-red' : 'btn-green'}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 5, fontFamily: 'inherit' }}
              >
                {cantieriPending ? '...' : user.cantieri_visibili ? 'Nascondi' : 'Abilita'}
              </button>
            </form>
          ) : (
            <span style={{ fontSize: 12, color: '#ccc' }}>—</span>
          )}
        </td>
      )}
      {hasClienti && (
        <td style={{ padding: '10px 12px' }}>
          {user.role === 'cliente' ? (
            <form action={ordiniAction} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="hidden" name="username" value={user.username} />
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                fontSize: 11, fontWeight: 600, color: '#fff',
                background: user.miei_ordini_visibili ? '#4a8f6b' : '#888',
              }}>
                {user.miei_ordini_visibili ? 'Visibile' : 'Nascosto'}
              </span>
              <button
                type="submit"
                disabled={ordiniPending}
                className={ordiniPending ? 'btn-gray' : user.miei_ordini_visibili ? 'btn-red' : 'btn-green'}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 5, fontFamily: 'inherit' }}
              >
                {ordiniPending ? '...' : user.miei_ordini_visibili ? 'Nascondi' : 'Abilita'}
              </button>
            </form>
          ) : (
            <span style={{ fontSize: 12, color: '#ccc' }}>—</span>
          )}
        </td>
      )}
      <td style={{ padding: '10px 12px' }}>
        <PasswordCell user={user} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        {isSelf ? (
          <span style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic' }}>Non modificabile</span>
        ) : (
          <form action={roleAction} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="hidden" name="username" value={user.username} />
            <select
              name="role"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{
                padding: '5px 8px', fontSize: 13, border: '1px solid #ccc',
                borderRadius: 5, fontFamily: 'inherit', background: '#fff', cursor: 'pointer',
              }}
            >
              {ALL_ASSIGNABLE_ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!dirty || rolePending}
              className={!dirty || rolePending ? 'btn-gray' : 'btn-green'}
              style={{ padding: '5px 12px', fontSize: 12, borderRadius: 5, fontFamily: 'inherit' }}
            >
              {rolePending ? '...' : 'Salva'}
            </button>
            {roleResult && !roleResult.ok && (
              <span style={{ fontSize: 12, color: '#c00' }}>{roleResult.error}</span>
            )}
          </form>
        )}
      </td>
    </tr>
  )
}

function SortIcon({ col, sortCol, sortDir }: { col: SortCol; sortCol: SortCol; sortDir: 'asc' | 'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

const thStyle: React.CSSProperties = {
  padding: '9px 12px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
}

export default function GestioneUtentiClient({ users, currentUser }: { users: User[]; currentUser: string }) {
  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortCol, setSortCol] = useState<SortCol>('username')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const hasClienti = users.some(u => u.role === 'cliente')

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const filtered = users
    .filter(u => {
      const q = filter.toLowerCase()
      const matchText = !q || (
        u.username.toLowerCase().includes(q) ||
        u.nome.toLowerCase().includes(q) ||
        u.cognome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
      const matchRole = !roleFilter || u.role === roleFilter
      return matchText && matchRole
    })
    .sort((a, b) => {
      let va: string | number
      let vb: string | number
      if (sortCol === 'nome') {
        va = `${a.nome} ${a.cognome}`.toLowerCase()
        vb = `${b.nome} ${b.cognome}`.toLowerCase()
      } else if (sortCol === 'is_active') {
        va = a.is_active
        vb = b.is_active
      } else {
        va = ((a[sortCol] as string) ?? '').toLowerCase()
        vb = ((b[sortCol] as string) ?? '').toLowerCase()
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Filtri */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '20px 24px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>Filtra utenti</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Cerca per username, nome, cognome o email…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14,
              border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit',
            }}
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px', fontSize: 14, border: '1px solid #ccc',
              borderRadius: 6, fontFamily: 'inherit', background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="">Tutti i ruoli</option>
            {ALL_ASSIGNABLE_ROLES.map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabella utenti */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Utenti registrati{(filter || roleFilter) ? ` — ${filtered.length} risultati` : ` — ${users.length} totali`}
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                <th style={thStyle} onClick={() => handleSort('username')}>
                  Username <SortIcon col="username" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th style={thStyle} onClick={() => handleSort('nome')}>
                  Nome <SortIcon col="nome" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th style={thStyle} onClick={() => handleSort('email')}>
                  Email <SortIcon col="email" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th style={{ ...thStyle, cursor: 'default' }}>Cellulare</th>
                <th style={thStyle} onClick={() => handleSort('role')}>
                  Ruolo <SortIcon col="role" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th style={thStyle} onClick={() => handleSort('is_active')}>
                  Stato <SortIcon col="is_active" sortCol={sortCol} sortDir={sortDir} />
                </th>
                {hasClienti && (
                  <th style={{ ...thStyle, cursor: 'default' }}>I Miei Cantieri</th>
                )}
                {hasClienti && (
                  <th style={{ ...thStyle, cursor: 'default' }}>I Miei Ordini</th>
                )}
                <th style={{ ...thStyle, cursor: 'default' }}>Password</th>
                <th style={{ ...thStyle, cursor: 'default' }}>Modifica ruolo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={hasClienti ? 10 : 8} style={{ padding: '24px', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
                    Nessun utente trovato.
                  </td>
                </tr>
              ) : (
                filtered.map(u => <RoleRow key={u.username} user={u} isSelf={u.username === currentUser} hasClienti={hasClienti} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
