'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'

export async function eseguiQuery(sql: string): Promise<{ columns: string[]; rows: Record<string, unknown>[]; rowsAffected?: number; error?: string }> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    return { columns: [], rows: [], error: 'Non autorizzato' }
  }

  const trimmed = sql.trim()
  if (!trimmed) return { columns: [], rows: [], error: 'Query vuota' }

  const conn = await getConnection()
  try {
    const [result] = await conn.execute(trimmed)

    if (Array.isArray(result)) {
      const rows = result as Record<string, unknown>[]
      const columns = rows.length > 0 ? Object.keys(rows[0]) : []
      return { columns, rows }
    } else {
      const info = result as { affectedRows: number }
      return { columns: [], rows: [], rowsAffected: info.affectedRows }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { columns: [], rows: [], error: msg }
  } finally {
    await conn.end()
  }
}
