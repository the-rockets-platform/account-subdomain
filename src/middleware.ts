import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { prisma } from './clients/prisma';
import { unauthorized as err_code_unauthorized } from "@/types/api/errors";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({req: request});  

  if (request.nextUrl.pathname.startsWith('/api')) {
    // /api routes logic (excluding /api/auth/...)

    if (token === null) {
      return new NextResponse(
        JSON.stringify({ error_code: err_code_unauthorized, message: 'unauthenticated' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
    
    return NextResponse.next();
  }


  if (token === null) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  prisma.$connect();

  if (!["/profile", "/org"].some((p => request.nextUrl.pathname.startsWith(p)))) {
  
    const shouldCompleteProfile = await prisma.userProfile.findUnique({
      select: {id: true},
      where: {
        userId: token.sub,
        OR: [
          { name: {equals: null} },
          { lastName: {equals: null} },
          { phone: {equals: null} },
          { cpf_cnpj: {equals: null} }
        ]
      },
      cacheStrategy: {
        ttl: 30
      }
    });
    
    if (shouldCompleteProfile) {
      prisma.$disconnect();
      return NextResponse.redirect(new URL('/profile?completeProfile=Y', request.url))
    }

    try {
      const hasOrganization = await prisma.organizationUser.findFirst({
        select: {organizationId: true},
        where: {
          userId: token.sub,
        },
        cacheStrategy: {
          ttl: 5
        }
      });
      if (!hasOrganization) {
        prisma.$disconnect();
        return NextResponse.redirect(new URL('/org/?newUser=Y', request.url))
      }
    } catch (e) {
      prisma.$disconnect();
      return NextResponse.redirect(new URL('/org?newUser=Y', request.url))
    }

  }
  
  prisma.$disconnect();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|auth|privacy|t|terms|favicon.ico).*)'
  ],
}