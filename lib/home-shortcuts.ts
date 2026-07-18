/** Scorciatoie home salvate dall'utente nel proprio browser (localStorage, per dispositivo). */

export type Shortcut = { href: string; label: string }

const KEY = 'home_shortcuts'
export const SHORTCUTS_EVENT = 'home-shortcuts-changed'

export function getShortcuts(): Shortcut[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Shortcut[]) : []
  } catch {
    return []
  }
}

function save(list: Shortcut[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(SHORTCUTS_EVENT))
}

export function isShortcut(href: string): boolean {
  return getShortcuts().some(s => s.href === href)
}

export function addShortcut(href: string, label: string) {
  const list = getShortcuts()
  if (list.some(s => s.href === href)) return
  save([...list, { href, label }])
}

export function removeShortcut(href: string) {
  save(getShortcuts().filter(s => s.href !== href))
}
