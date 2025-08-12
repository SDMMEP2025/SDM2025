// src/middleware.ts (최종)
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const ROOT_DOMAIN = 'newformative.com'
const ALLOW_HOSTS = new Set(['newformative.com', 'www.newformative.com'])

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const host = (req.headers.get('host') || req.nextUrl.hostname).toLowerCase()

  if (ALLOW_HOSTS.has(host)) return res

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.slice(0, -(`.${ROOT_DOMAIN}`).length) // 'beta' | 'invite' ...
    if (sub === 'beta') {
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
    }
  }
  return res
}

export const config = { matcher: ['/(.*)'] }
