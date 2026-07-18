'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  getShortcuts as getLocalShortcuts,
  addShortcut as addLocalShortcut,
  removeShortcut as removeLocalShortcut,
  SHORTCUTS_EVENT,
  type Shortcut,
} from '@/lib/home-shortcuts'
import { getMyShortcuts, addMyShortcut, removeMyShortcut } from '@/lib/home-shortcuts-db'
import { isHrefAccessible } from '@/lib/nav-config'

type Ctx = {
  shortcuts: Shortcut[]
  isShortcut: (href: string) => boolean
  add: (href: string, label: string) => void
  remove: (href: string) => void
}

const HomeShortcutsCtx = createContext<Ctx | null>(null)

type Props = {
  loggedIn: boolean
  role: string | null
  rolePermissions: Record<string, number[]>
  disabledPages: number[]
  children: React.ReactNode
}

/**
 * Sloggato: legge/scrive solo lib/home-shortcuts.ts (localStorage, per browser).
 * Loggato: legge/scrive sia localStorage sia DB (home_shortcuts, per account).
 * Al mount da loggato fa una migrazione una tantum: le scorciatoie già in
 * localStorage (magari salvate prima del login sullo stesso browser) vengono
 * inserite nel DB SOLO se accessibili per il ruolo corrente — un computer
 * condiviso potrebbe avere in localStorage pagine valide per un altro utente
 * ma non per questo.
 */
export function HomeShortcutsProvider({ loggedIn, role, rolePermissions, disabledPages, children }: Props) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => (loggedIn ? [] : getLocalShortcuts()))
  const migrated = useRef(false)

  useEffect(() => {
    if (!loggedIn) {
      setShortcuts(getLocalShortcuts())
      function onLocalChange() { setShortcuts(getLocalShortcuts()) }
      window.addEventListener(SHORTCUTS_EVENT, onLocalChange)
      return () => window.removeEventListener(SHORTCUTS_EVENT, onLocalChange)
    }

    if (migrated.current) return
    migrated.current = true

    ;(async () => {
      const [dbList, localList] = await Promise.all([getMyShortcuts(), Promise.resolve(getLocalShortcuts())])

      // Solo localStorage → DB, filtrato per accessibilità del ruolo corrente.
      // NON scriviamo le voci del DB nel localStorage condiviso: su un
      // computer condiviso, un login successivo di un altro utente
      // rileggerebbe quella voce e la re-inserirebbe nel proprio DB,
      // "resuscitando" scorciatoie già cancellate da altri account.
      const accessibleLocal = localList.filter(s => isHrefAccessible(s.href, role, rolePermissions, disabledPages))
      const dbHrefs = new Set(dbList.map(s => s.href))
      const toInsert = accessibleLocal.filter(s => !dbHrefs.has(s.href))
      await Promise.all(toInsert.map(s => addMyShortcut(s.href, s.label)))

      const merged = [...dbList, ...toInsert]
      setShortcuts(merged)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn])

  function isShortcut(href: string) {
    return shortcuts.some(s => s.href === href)
  }

  function add(href: string, label: string) {
    addLocalShortcut(href, label)
    setShortcuts(prev => (prev.some(s => s.href === href) ? prev : [...prev, { href, label }]))
    if (loggedIn) void addMyShortcut(href, label)
  }

  function remove(href: string) {
    removeLocalShortcut(href)
    setShortcuts(prev => prev.filter(s => s.href !== href))
    if (loggedIn) void removeMyShortcut(href)
  }

  return (
    <HomeShortcutsCtx.Provider value={{ shortcuts, isShortcut, add, remove }}>
      {children}
    </HomeShortcutsCtx.Provider>
  )
}

export function useHomeShortcuts(): Ctx {
  const ctx = useContext(HomeShortcutsCtx)
  if (!ctx) throw new Error('useHomeShortcuts deve essere usato dentro HomeShortcutsProvider')
  return ctx
}
