import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Chạy middleware trên tất cả routes NGOẠI TRỪ:
    // - _next/static, _next/image (Next.js internals)
    // - favicon và ảnh tĩnh
    // - /api/ routes (API tự xử lý auth nếu cần)
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
