import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('session_user')
  cookieStore.delete('session_role')
  const { searchParams } = new URL(request.url)
  const dest = searchParams.get('dest') ?? '/'
  return NextResponse.redirect(new URL(dest, request.url))
}
