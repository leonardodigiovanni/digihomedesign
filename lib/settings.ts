import fs from 'fs'
import path from 'path'

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
  bannerTesto: string
}

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

const DEFAULTS: AppSettings = {
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
    cliente:         [30, 31],
  },
}

export function readSettings(): AppSettings {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function writeSettings(settings: AppSettings): void {
  const dir = path.dirname(SETTINGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const { manutenzione, ...rest } = settings
  const ordered = { manutenzione, ...rest }
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(ordered, null, 2), 'utf-8')
}
