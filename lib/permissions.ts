import type { AppSettings } from './settings'

export const ALL_ROLES = [
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
] as const

export type Role = typeof ALL_ROLES[number] | 'admin'

export function hasPageAccess(
  role: string | null,
  pageId: number,
  settings: AppSettings
): boolean {
  if (!role) return false
  if (role === 'admin') return true
  const allowed = settings.rolePermissions[role] ?? []
  return allowed.includes(pageId)
}
