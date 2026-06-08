import { getConnection } from '@/lib/db'

export type Rgba = { r: number; g: number; b: number; a: number }

export type BgMode =
  | 'rgb'
  | 'rgb_a' | 'rgb_b' | 'rgb_c' | 'rgb_d'
  | 'rgb_a_inv' | 'rgb_b_inv' | 'rgb_c_inv' | 'rgb_d_inv'
  | 'gold_a' | 'gold_b' | 'gold_c' | 'gold_d'
  | 'gold_a_inv' | 'gold_b_inv' | 'gold_c_inv' | 'gold_d_inv'
  | 'silver_a' | 'silver_b' | 'silver_c' | 'silver_d'
  | 'silver_a_inv' | 'silver_b_inv' | 'silver_c_inv' | 'silver_d_inv'

export type AppSettings = {
  inactivityMinutes: number
  countdownSeconds: number
  headerBg: Rgba
  headerBgMode: BgMode
  footerBg: Rgba
  footerBgMode: BgMode
  pageBg: Rgba
  pageBgMode: BgMode
  disabledPages: number[]
  registrazioniDisabilitate: boolean
  loginClientiDisabilitato: boolean
  loginDipendentiDisabilitato: boolean
  rolePermissions: Record<string, number[]>
  manutenzione: boolean
  bannerAbilitato: boolean
  bannerCircolare: boolean
  bannerTesto: string
}

export const DEFAULTS: AppSettings = {
  inactivityMinutes: 30,
  countdownSeconds: 60,
  headerBg:     { r: 255, g: 255, b: 255, a: 100 },
  headerBgMode: 'rgb',
  footerBg:     { r: 255, g: 255, b: 255, a: 100 },
  footerBgMode: 'rgb',
  pageBg:       { r: 245, g: 245, b: 245, a: 100 },
  pageBgMode:   'rgb',
  disabledPages: [],
  registrazioniDisabilitate: false,
  loginClientiDisabilitato: false,
  loginDipendentiDisabilitato: false,
  manutenzione: false,
  bannerAbilitato: false,
  bannerCircolare: false,
  bannerTesto: '',
  rolePermissions: {
    dipendente:      [16, 17, 18],
    ragioniere:      [17, 21],
    commercialista:  [18, 22],
    venditore:       [23, 24, 25, 26],
    operaio:         [27],
    magazzino:       [16],
    direttore:       [28],
    marketing:       [29],
    email:           [],
    cliente:         [50, 51, 52, 53, 55],
  },
}

async function ensureTable(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id   INT NOT NULL DEFAULT 1,
      data JSON NOT NULL,
      PRIMARY KEY (id)
    )
  `)
}

export async function readSettings(): Promise<AppSettings> {
  const db = await getConnection()
  try {
    await ensureTable(db)
    const [rows] = await db.query('SELECT data FROM app_settings WHERE id = 1 LIMIT 1')
    const row = (rows as { data: string | AppSettings }[])[0]
    if (!row) return { ...DEFAULTS }
    const parsed = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    const merged: AppSettings = { ...DEFAULTS, ...parsed }
    // Migra vecchio default cliente:[30,31] (internalPages) verso areaClientiPages IDs
    const areaClientiIds = [50, 51, 52, 53, 55]
    const clientePerms: number[] = merged.rolePermissions?.cliente ?? []
    if (!clientePerms.some(id => areaClientiIds.includes(id))) {
      merged.rolePermissions = { ...merged.rolePermissions, cliente: areaClientiIds }
    }
    return merged
  } catch {
    return { ...DEFAULTS }
  } finally {
    await db.end()
  }
}

export async function writeSettings(settings: AppSettings): Promise<void> {
  const db = await getConnection()
  try {
    await ensureTable(db)
    const { manutenzione, ...rest } = settings
    const ordered = { manutenzione, ...rest }
    await db.execute(
      'INSERT INTO app_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [JSON.stringify(ordered)]
    )
  } finally {
    await db.end()
  }
}
