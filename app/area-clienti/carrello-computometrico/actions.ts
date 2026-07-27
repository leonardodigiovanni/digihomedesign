'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { compressComputoCart, decompressComputoCart, COMPUTO_CART_COOKIE, type ComputoCartItem } from '@/lib/computo-cart-cookie'

export type RigaCarrello = ComputoCartItem

const CART_COOKIE = COMPUTO_CART_COOKIE

async function loadCart(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<ComputoCartItem[]> {
  return decompressComputoCart(cookieStore.get(CART_COOKIE)?.value ?? '')
}

function saveCart(cookieStore: Awaited<ReturnType<typeof cookies>>, cart: ComputoCartItem[]) {
  if (cart.length === 0) cookieStore.delete(CART_COOKIE)
  else cookieStore.set(CART_COOKIE, compressComputoCart(cart), { maxAge: 30 * 24 * 60 * 60, path: '/', sameSite: 'lax' })
}

// Id univoco per una nuova riga: non c'è più un autoincrement DB dietro (il
// carrello vive in un cookie, utilizzabile anche da anonimo), quindi si genera
// lato server da un timestamp + offset per gli inserimenti multipli in batch.
function nextUid(existing: ComputoCartItem[], offset = 0): number {
  const maxUid = existing.reduce((m, i) => Math.max(m, i.uid), 0)
  return Math.max(maxUid, Date.now()) + 1 + offset
}

export type RigaComputometrico = {
  uid: number
  parentUid?: number
  listino_id: number | null
  categoria: string
  produttore: string
  serie: string
  descrizione: string
  unita: string
  quantita: number
  larghezza_cm?: number
  altezza_cm?: number
  altezza3d_cm?: number
  base_calcolo?: string | null
  colore?: string
  prezzo_unitario: number
  totale_riga: number
  note: string
}

export type SalvaResult = { ok: boolean; error?: string; id?: number }

async function ensureTables(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS computometrico_articoli (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      computometrico_id INT NOT NULL,
      listino_id        INT NULL,
      categoria         VARCHAR(100) NOT NULL DEFAULT '',
      descrizione       VARCHAR(300) NOT NULL DEFAULT '',
      unita             VARCHAR(30)  NOT NULL DEFAULT 'pz',
      quantita          DECIMAL(10,4) NOT NULL DEFAULT 1,
      prezzo_unitario   DECIMAL(10,2) NOT NULL DEFAULT 0,
      totale_riga       DECIMAL(12,2) NOT NULL DEFAULT 0,
      note              TEXT NULL,
      ordine            INT NOT NULL DEFAULT 0,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  // Colonne aggiunte per permettere di riprendere un computometrico salvato nel
  // carrello (vedi riprendiComputometrico): senza queste, il salvataggio appiattiva
  // la gerarchia ambiente→voci e perdeva le misure, rendendo impossibile ricostruire
  // lo stato del wizard.
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN parent_id INT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN produttore VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN larghezza_cm DECIMAL(10,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN altezza_cm DECIMAL(10,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN altezza3d_cm DECIMAL(10,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN base_calcolo VARCHAR(20) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE computometrico_articoli ADD COLUMN colore VARCHAR(200) NULL`).catch(() => {})
}

export async function addRigaCarrello(data: Omit<RigaCarrello, 'uid'>): Promise<{ ok: boolean; uid?: number; error?: string }> {
  const cookieStore = await cookies()
  const cart = await loadCart(cookieStore)
  const uid = nextUid(cart)
  cart.push({ ...data, uid })
  saveCart(cookieStore, cart)
  return { ok: true, uid }
}

// Inserisce più righe in una sola chiamata (usato da "Applica"/"Applica a tutti gli
// ambienti": tante voci insieme, o la stessa voce ripetuta su più ambienti).
export async function addRigheCarrello(rows: Omit<RigaCarrello, 'uid'>[]): Promise<{ ok: boolean; uids?: number[]; error?: string }> {
  const cookieStore = await cookies()
  const cart = await loadCart(cookieStore)
  if (rows.length === 0) return { ok: true, uids: [] }

  const base = nextUid(cart)
  const uids: number[] = rows.map((_, i) => base + i)
  rows.forEach((data, i) => cart.push({ ...data, uid: uids[i] }))
  saveCart(cookieStore, cart)
  return { ok: true, uids }
}

export async function removeRigaCarrello(uid: number): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  const cart = await loadCart(cookieStore)
  const filtered = cart.filter(r => r.uid !== uid && r.parentUid !== uid)
  saveCart(cookieStore, filtered)
  return { ok: true }
}

// Aggiorna una riga già salvata. `prezzo_unitario`/`totale_riga` pensati per lo
// staff (può correggere il prezzo di una riga per quel computo specifico); `note`
// e `quantita` restano modificabili da chiunque.
export async function updateRigaCarrello(uid: number, updates: {
  note?: string
  quantita?: number
  prezzo_unitario?: number
  totale_riga?: number
}): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  const cart = await loadCart(cookieStore)
  const updated = cart.map(r => r.uid === uid ? { ...r, ...updates } : r)
  saveCart(cookieStore, updated)
  return { ok: true }
}

export async function clearCarrelloComputometrico(): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE)
  return { ok: true }
}

export async function salvaComputometrico(
  righe: RigaComputometrico[],
  descrizione: string
): Promise<SalvaResult> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  if (!username || !role) return { ok: false, error: 'Non autenticato.' }
  if (righe.length === 0) return { ok: false, error: 'Nessun articolo nel carrello.' }

  const db = await getConnection()
  try {
    await ensureTables(db)

    const [uRows] = await db.execute(
      'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ cliente_id: number | null }[], unknown]
    const clienteId = uRows[0]?.cliente_id ?? null

    const importo = righe.reduce((acc, r) => acc + r.totale_riga, 0)
    const today = new Date().toISOString().slice(0, 10)
    const [ins] = await db.execute(
      `INSERT INTO computometrici (numero, cliente_id, creato_da, descrizione, stato, importo_stimato, data, note, visibile_cliente)
       VALUES ('', ?, ?, ?, 'bozza', ?, ?, NULL, 1)`,
      [clienteId, username, descrizione || 'Nuova stima', importo, today]
    ) as [{ insertId: number }, unknown]
    const computometricoId = ins.insertId

    await db.execute(
      `UPDATE computometrici SET numero = CONCAT('C-', id) WHERE id = ?`,
      [computometricoId]
    )

    // Due passate per preservare la gerarchia ambiente→voci: prima le righe
    // padre (senza parentUid) per ottenere il nuovo id, poi le figlie con
    // parent_id rimappato — stesso pattern usato per clonare i preventivi.
    const idMap = new Map<number, number>()
    let ordine = 0
    for (const r of righe.filter(r => r.parentUid == null)) {
      const [ins2] = await db.execute(
        `INSERT INTO computometrico_articoli
           (computometrico_id, parent_id, listino_id, categoria, produttore, serie, descrizione,
            unita, quantita, larghezza_cm, altezza_cm, altezza3d_cm, base_calcolo, colore,
            prezzo_unitario, totale_riga, note, ordine)
         VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [computometricoId, r.listino_id ?? null, r.categoria, r.produttore, r.serie, r.descrizione, r.unita,
         r.quantita, r.larghezza_cm ?? null, r.altezza_cm ?? null, r.altezza3d_cm ?? null, r.base_calcolo ?? null,
         r.colore ?? null, r.prezzo_unitario, r.totale_riga, r.note || null, ordine++]
      ) as [{ insertId: number }, unknown]
      idMap.set(r.uid, ins2.insertId)
    }
    for (const r of righe.filter(r => r.parentUid != null)) {
      const newParentId = idMap.get(r.parentUid!) ?? null
      await db.execute(
        `INSERT INTO computometrico_articoli
           (computometrico_id, parent_id, listino_id, categoria, produttore, serie, descrizione,
            unita, quantita, larghezza_cm, altezza_cm, altezza3d_cm, base_calcolo, colore,
            prezzo_unitario, totale_riga, note, ordine)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [computometricoId, newParentId, r.listino_id ?? null, r.categoria, r.produttore, r.serie, r.descrizione, r.unita,
         r.quantita, r.larghezza_cm ?? null, r.altezza_cm ?? null, r.altezza3d_cm ?? null, r.base_calcolo ?? null,
         r.colore ?? null, r.prezzo_unitario, r.totale_riga, r.note || null, ordine++]
      )
    }

    revalidatePath('/area-clienti/computometrici')
    return { ok: true, id: computometricoId }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}

// Riporta un computometrico salvato (solo se ancora in bozza) nel carrello per
// continuare a modificarlo con lo stesso wizard a crocette — come i preventivi,
// dove il record salvato è già l'oggetto editabile. Qui invece serve ricopiare
// le righe nel carrello perché l'editing avviene solo lì; il computometrico
// originale viene poi cancellato (è una ripresa, non un duplicato).
export async function riprendiComputometrico(id: number): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  if (!username || !role) return { ok: false, error: 'Non autenticato.' }
  if (!id) return { ok: false, error: 'ID non valido.' }

  const isStaff = role === 'admin' || role === 'dipendente'
  const db = await getConnection()
  try {
    await ensureTables(db)

    const [cRows] = await db.query(
      'SELECT id, cliente_id, creato_da, stato FROM computometrici WHERE id = ? LIMIT 1', [id]
    ) as [{ id: number; cliente_id: number | null; creato_da: string | null; stato: string }[], unknown]
    const comp = cRows[0]
    if (!comp) return { ok: false, error: 'Computo metrico non trovato.' }
    if (comp.stato !== 'bozza') return { ok: false, error: 'Solo un computo in bozza può essere ripreso.' }

    if (!isStaff) {
      const [uRows] = await db.query(
        'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      const ownedByClienteId = clienteId !== null && Number(comp.cliente_id) === clienteId
      const ownedByUsername  = comp.cliente_id == null && String(comp.creato_da ?? '') === username
      if (!ownedByClienteId && !ownedByUsername) return { ok: false, error: 'Non autorizzato.' }
    }

    const [righeRows] = await db.query(
      `SELECT id, parent_id, listino_id, categoria, produttore, serie, descrizione, unita, quantita,
              larghezza_cm, altezza_cm, altezza3d_cm, base_calcolo, colore, note, prezzo_unitario, totale_riga
       FROM computometrico_articoli WHERE computometrico_id = ? ORDER BY ordine ASC, id ASC`,
      [id]
    ) as [Record<string, unknown>[], unknown]
    const righe = righeRows as Record<string, unknown>[]

    // Due passate per rimappare parent_id sui nuovi uid generati per il carrello
    // (sostituisce interamente il carrello corrente, come già avvisato dalla
    // conferma lato client prima di chiamare questa azione).
    const cart: ComputoCartItem[] = []
    const idMap = new Map<number, number>()
    let nextFreeUid = Date.now()
    for (const r of righe.filter(r => r.parent_id == null)) {
      const uid = nextFreeUid++
      idMap.set(Number(r.id), uid)
      cart.push({
        uid,
        listino_id: Number(r.listino_id ?? 0), categoria: String(r.categoria ?? ''),
        produttore: String(r.produttore ?? ''), serie: String(r.serie ?? ''),
        descrizione: String(r.descrizione ?? ''), unita: String(r.unita ?? 'pz'),
        quantita: Number(r.quantita ?? 1),
        larghezza_cm: r.larghezza_cm != null ? Number(r.larghezza_cm) : undefined,
        altezza_cm: r.altezza_cm != null ? Number(r.altezza_cm) : undefined,
        altezza3d_cm: r.altezza3d_cm != null ? Number(r.altezza3d_cm) : undefined,
        base_calcolo: r.base_calcolo != null ? String(r.base_calcolo) : null,
        colore: r.colore != null ? String(r.colore) : undefined,
        note: r.note != null ? String(r.note) : undefined,
        prezzo_unitario: Number(r.prezzo_unitario ?? 0), totale_riga: Number(r.totale_riga ?? 0),
      })
    }
    for (const r of righe.filter(r => r.parent_id != null)) {
      const uid = nextFreeUid++
      cart.push({
        uid, parentUid: idMap.get(Number(r.parent_id)),
        listino_id: Number(r.listino_id ?? 0), categoria: String(r.categoria ?? ''),
        produttore: String(r.produttore ?? ''), serie: String(r.serie ?? ''),
        descrizione: String(r.descrizione ?? ''), unita: String(r.unita ?? 'pz'),
        quantita: Number(r.quantita ?? 1),
        larghezza_cm: r.larghezza_cm != null ? Number(r.larghezza_cm) : undefined,
        altezza_cm: r.altezza_cm != null ? Number(r.altezza_cm) : undefined,
        altezza3d_cm: r.altezza3d_cm != null ? Number(r.altezza3d_cm) : undefined,
        base_calcolo: r.base_calcolo != null ? String(r.base_calcolo) : null,
        colore: r.colore != null ? String(r.colore) : undefined,
        note: r.note != null ? String(r.note) : undefined,
        prezzo_unitario: Number(r.prezzo_unitario ?? 0), totale_riga: Number(r.totale_riga ?? 0),
      })
    }
    saveCart(cookieStore, cart)

    await db.execute('DELETE FROM computometrico_articoli WHERE computometrico_id = ?', [id])
    await db.execute('DELETE FROM computometrici WHERE id = ?', [id])

    revalidatePath('/area-clienti/carrello-computometrico')
    revalidatePath('/area-clienti/computometrici')
    revalidatePath('/clienti/computometrici')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}
