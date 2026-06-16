import { NextResponse } from 'next/server'
import { readSettings } from '@/lib/settings'

export async function GET() {
  const { manutenzione } = await readSettings()
  return NextResponse.json({ manutenzione })
}
