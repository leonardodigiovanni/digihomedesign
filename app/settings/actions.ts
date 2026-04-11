'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { writeSettings, readSettings, type Rgba, type BgMode } from '@/lib/settings'
import { ALL_ROLES } from '@/lib/permissions'
import { internalPages } from '@/lib/nav-config'

export type SaveResult =
  | { ok: true; inactivityMinutes: number; countdownSeconds: number }
  | { ok: false; error: string }

export type SaveBgResult =
  | { ok: true; color: Rgba; mode: BgMode }
  | { ok: false; error: string }

export async function saveSettings(
  _prev: SaveResult | null,
  formData: FormData
): Promise<SaveResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const minutes = Number(formData.get('inactivityMinutes'))
  const seconds = Number(formData.get('countdownSeconds'))

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 480) {
    return { ok: false, error: 'Minuti non validi (1–480).' }
  }
  if (!Number.isInteger(seconds) || seconds < 5 || seconds > 300) {
    return { ok: false, error: 'Secondi non validi (5–300).' }
  }

  const current = readSettings()
  writeSettings({ ...current, inactivityMinutes: minutes, countdownSeconds: seconds })
  return { ok: true, inactivityMinutes: minutes, countdownSeconds: seconds }
}

async function saveBgField(
  field: 'headerBg' | 'footerBg' | 'pageBg',
  modeField: 'headerBgMode' | 'footerBgMode' | 'pageBgMode',
  formData: FormData
): Promise<SaveBgResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const mode = (formData.get('mode') as BgMode) ?? 'rgb'
  const r = Number(formData.get('r'))
  const g = Number(formData.get('g'))
  const b = Number(formData.get('b'))
  const a = Number(formData.get('a'))

  // Validiamo sempre l'RGB così viene preservato per quando si torna alla modalità RGB
  for (const ch of [r, g, b]) {
    if (!Number.isInteger(ch) || ch < 0 || ch > 255) {
      return { ok: false, error: 'Valori RGB non validi (0–255).' }
    }
  }
  if (!Number.isInteger(a) || a < 0 || a > 100) {
    return { ok: false, error: 'Valore alpha non valido (0–100).' }
  }

  const current = readSettings()
  const color = { r, g, b, a }
  writeSettings({ ...current, [field]: color, [modeField]: mode })
  return { ok: true, color, mode }
}

export async function saveHeaderBg(_prev: SaveBgResult | null, formData: FormData): Promise<SaveBgResult> {
  return saveBgField('headerBg', 'headerBgMode', formData)
}

export async function saveFooterBg(_prev: SaveBgResult | null, formData: FormData): Promise<SaveBgResult> {
  return saveBgField('footerBg', 'footerBgMode', formData)
}

export async function savePageBg(_prev: SaveBgResult | null, formData: FormData): Promise<SaveBgResult> {
  return saveBgField('pageBg', 'pageBgMode', formData)
}

export type SaveAccessResult =
  | { ok: true }
  | { ok: false; error: string }

export async function saveDisabledPages(
  _prev: SaveAccessResult | null,
  formData: FormData
): Promise<SaveAccessResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const disabledPages: number[] = []
  for (let i = 2; i <= 15; i++) {
    if (!formData.get(`page_${i}`)) disabledPages.push(i)
  }

  const current = readSettings()
  writeSettings({ ...current, disabledPages })
  return { ok: true }
}

export async function saveAccessControls(
  _prev: SaveAccessResult | null,
  formData: FormData
): Promise<SaveAccessResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const registrazioniDisabilitate   = !formData.get('registrazioni')
  const loginClientiDisabilitato     = !formData.get('loginClienti')
  const loginDipendentiDisabilitato  = !formData.get('loginDipendenti')

  const current = readSettings()
  writeSettings({ ...current, registrazioniDisabilitate, loginClientiDisabilitato, loginDipendentiDisabilitato })
  return { ok: true }
}

export async function toggleManutenzione(
  _prev: SaveAccessResult | null,
  formData: FormData
): Promise<SaveAccessResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')
  const current = readSettings()
  writeSettings({ ...current, manutenzione: !current.manutenzione })
  return { ok: true }
}

export async function saveRolePermissions(
  _prev: SaveAccessResult | null,
  formData: FormData
): Promise<SaveAccessResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const rolePermissions: Record<string, number[]> = {}
  for (const role of ALL_ROLES) {
    rolePermissions[role] = internalPages
      .filter(p => formData.get(`perm_${role}_${p.id}`) === '1')
      .map(p => p.id)
  }

  const current = readSettings()
  writeSettings({ ...current, rolePermissions })
  return { ok: true }
}
