import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  if (user) {
    // Check user role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = '/jury'
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith('/jury') && role !== 'jury') {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    
    // Redirect / to appropriate dashboard
    if (request.nextUrl.pathname === '/') {
        url.pathname = role === 'admin' ? '/admin' : '/jury'
        return NextResponse.redirect(url)
    }
  } else if (!request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
