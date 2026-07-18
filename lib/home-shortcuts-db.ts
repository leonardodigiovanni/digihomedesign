'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Shortcut } from '@/lib/home-shortcuts'

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS home_shortcuts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      username   VARCHAR(191) NOT NULL,
      href       VARCHAR(255) NOT NULL,
      label      VARCHAR(255) NOT NULL,
      cancellato TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_username_href (username, href)
    )
  `)
  await db.execute(`ALTER TABLE home_shortcuts ADD COLUMN cancellato TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.end()
}

async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('session_user')?.value ?? null
}

/**
 * Solo le scorciatoie attive (cancellato = 0). Le righe rimosse restano nel
 * DB per sempre (mai una DELETE) — servono a capire a cosa un utente si è
 * interessato nel tempo, anche dopo che le ha rimosse dalla propria home.
 */
export async function getMyShortcuts(): Promise<Shortcut[]> {
  const username = await getUsername()
  if (!username) return []
  await ensureTable()
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT href, label FROM home_shortcuts WHERE username = ? AND cancellato = 0 ORDER BY created_at',
      [username]
    ) as [Shortcut[], unknown]
    return rows
  } finally {
    await db.end()
  }
}

export async function addMyShortcut(href: string, label: string): Promise<void> {
  const username = await getUsername()
  if (!username) return
  await ensureTable()
  const db = await getConnection()
  try {
    // Se la riga esiste già (magari cancellata in precedenza), la riattiva
    // invece di ignorarla: la UNIQUE KEY (username, href) impedirebbe
    // altrimenti un nuovo INSERT.
    await db.execute(
      `INSERT INTO home_shortcuts (username, href, label, cancellato) VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE cancellato = 0, label = VALUES(label)`,
      [username, href, label]
    )
  } finally {
    await db.end()
  }
}

export async function removeMyShortcut(href: string): Promise<void> {
  const username = await getUsername()
  if (!username) return
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE home_shortcuts SET cancellato = 1 WHERE username = ? AND href = ?',
      [username, href]
    )
  } finally {
    await db.end()
  }
}
