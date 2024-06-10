import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Kullanıcı giriş yapmışsa ve /login veya /register sayfasına gitmeye çalışıyorsa ana sayfaya yönlendir
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = req.nextUrl.clone()
    url.pathname = `/${token.role.toLowerCase()}dashboard`
    return NextResponse.redirect(url)
  }

  if (token) {
    // Kullanıcı token'ı varsa ve /userdashboard sayfasına gitmek istiyorsa
    if (pathname.startsWith('/userdashboard')) {
      if (token.role === 'USER') {
        return NextResponse.next()
      } else {
        const url = req.nextUrl.clone()
        url.pathname = '/admindashboard'
        return NextResponse.redirect(url)
      }
    }
    // Kullanıcı token'ı varsa ve /admindashboard sayfasına gitmek istiyorsa
    if (pathname.startsWith('/admindashboard')) {
      if (token.role === 'ADMIN') {
        return NextResponse.next()
      } else {
        const url = req.nextUrl.clone()
        url.pathname = '/userdashboard'
        return NextResponse.redirect(url)
      }
    }
    // Kullanıcı token'ı varsa ve izin verilen bir sayfaya gitmeye çalışıyorsa
    return NextResponse.next()
  }

  // Kullanıcı token'ı yoksa ve /userdashboard veya /admindashboard sayfasına gitmeye çalışıyorsa login sayfasına yönlendir
  if (
    pathname.startsWith('/userdashboard') ||
    pathname.startsWith('/admindashboard')
  ) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', req.nextUrl.toString())
    return NextResponse.redirect(url)
  }

  // Kullanıcı token'ı yoksa ve izin verilen bir sayfaya gitmeye çalışıyorsa
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/userdashboard/:path*',
    '/admindashboard/:path*',
    '/login',
    '/register',
  ],
}
