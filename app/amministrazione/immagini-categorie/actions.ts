'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getConnection } from '@/lib/db'
import {
  clearImmagineCategoria, clearImmagineSottocategoria, ensureCategoriaImmaginiTables,
  type TipoCategoriaImmagini, type TipoConSottocategoria, type SlotImmagine,
} from '@/lib/categoria-immagini'

async function checkAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')
}

export async function rimuoviImmagineCategoria(tipo: TipoCategoriaImmagini, categoria: string, sottocategoria: string, slot: SlotImmagine): Promise<void> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await ensureCategoriaImmaginiTables(db)
    if (slot === 'categoria') await clearImmagineCategoria(db, tipo, categoria)
    else await clearImmagineSottocategoria(db, tipo as TipoConSottocategoria, categoria, sottocategoria)
    revalidatePath('/amministrazione/immagini-categorie')
    revalidatePath('/shop')
    revalidatePath('/promozioni')
    revalidatePath('/cataloghi')
  } finally {
    await db.end()
  }
}
