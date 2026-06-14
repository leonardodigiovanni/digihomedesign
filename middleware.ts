import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect profilo incompleto
  const profiloIncompleto = request.cookies.get('profilo_incompleto')?.value
  if (profiloIncompleto) {
    if (
      pathname.startsWith('/app') &&
      !pathname.startsWith('/app/completa-profilo') &&
      !pathname.startsWith('/app/login') &&
      !pathname.startsWith('/app/registrazione')
    ) {
      return NextResponse.redirect(new URL('/app/completa-profilo', request.url))
    }
    const SITE_PROTECTED = ['/area-clienti', '/area-lavoro', '/amministrazione', '/clienti', '/disegno', '/settings', '/gestione-utenti']
    const onSiteProtected = SITE_PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))
    if (onSiteProtected && !pathname.startsWith('/completa-profilo')) {
      return NextResponse.redirect(new URL('/completa-profilo', request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|uploads|icon.png|sw.js|manifest.json).*)'],
}
