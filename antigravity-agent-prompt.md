# 🤖MASTER IMPLEMENTATION PROMPT
# Project: CL Film — Website Xem Phim Gia Đình

> **Đọc toàn bộ file này trước khi bắt đầu. Làm theo đúng thứ tự.**
> Hai file tham chiếu bổ sung: `01_PHAN_TICH_DU_AN.md` và `02_KE_HOACH_TRIEN_KHAI.md`

---

## 📌 THÔNG TIN DỰ ÁN

```
Tên ứng dụng : CL Film
Framework    : Next.js 14 (App Router, TypeScript)
Database/Auth: Supabase (đã được cấp credentials)
Deploy       : Vercel (free tier)
Movie API    : https://phimapi.com (KKPhim, miễn phí, không cần key)
Email        : Resend (password reset)
```

### Environment Variables (tạo `.env.local` với nội dung sau — điền credentials của bạn)

> ⚠️ **KHÔNG commit file `.env.local` lên Git.** Kiểm tra `.gitignore` có chứa `.env.local`.

```env
# Lấy từ: https://supabase.com/dashboard/project/<project-id>/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # Chỉ dùng phía server, KHÔNG dùng trong client

# Lấy từ: https://resend.com/api-keys
RESEND_API_KEY=re_your-resend-key-here

# Tạo ngẫu nhiên: openssl rand -base64 32
CRON_SECRET=your-random-secret-here

# URL app (dev/production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CL Film
```

---

## 🏗️ PHASE 0: PROJECT INITIALIZATION

### Bước 0.1 — Tạo Next.js project

Chạy lệnh này trong terminal:
```bash
npx create-next-app@latest cl-film \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
cd cl-film
```

### Bước 0.2 — Cài dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install hls.js
npm install resend
npm install lucide-react
npm install clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-label @radix-ui/react-separator
npm install class-variance-authority
npm install isomorphic-dompurify        # XSS sanitization cho movie content
npm install -D @types/dompurify
```

> 💡 **Pin Next.js version** để tránh breaking changes từ v15:
> Sau khi tạo project, mở `package.json` và kiểm tra `"next"` đang là `14.x.x`. Nếu là `15.x.x`, chạy:
> ```bash
> npm install next@14.2.30
> ```

### Bước 0.3 — Cài shadcn/ui

```bash
npx shadcn@latest init
```

Chọn: Default style, Slate base color, CSS variables: Yes.

Sau đó cài các components:
```bash
npx shadcn@latest add button card input label badge skeleton toast dialog sheet select tabs separator
```

### Bước 0.4 — Tạo `.env.local`

Tạo file `.env.local` ở root project với nội dung từ phần "Environment Variables" ở trên.

### Bước 0.5 — Tạo cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── phim/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── xem/
│   │   │           └── page.tsx
│   │   ├── tim-kiem/
│   │   │   └── page.tsx
│   │   ├── danh-sach/
│   │   │   └── [type]/
│   │   │       └── page.tsx
│   │   ├── the-loai/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── quoc-gia/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── movies/
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       └── route.ts
│   │   └── search/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── movies/
│   │   ├── MovieCard.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── MovieHero.tsx
│   │   ├── MovieSection.tsx
│   │   └── EpisodeList.tsx
│   ├── player/
│   │   └── VideoPlayer.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchFilters.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── ui/        ← (shadcn components auto-generated)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── kkphim/
│   │   ├── api.ts
│   │   └── types.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useMovies.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## 🗄️ PHASE 1: SUPABASE SETUP

### Bước 1.1 — Chạy SQL migration trong Supabase Dashboard

Vào `https://supabase.com/dashboard/project/ftrfyerzeqaumjtdfplu` → SQL Editor → chạy:

```sql
-- Tạo bảng profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ xem profile của chính mình
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: user chỉ update profile của chính mình  
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Service role có thể insert (dùng cho trigger)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Trigger: tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function update updated_at tự động
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Bước 1.2 — Cấu hình Supabase Auth

Trong Supabase Dashboard → Authentication → Settings:
- **Disable email confirmation**: OFF (để user đăng nhập ngay)
- **Site URL**: `http://localhost:3000`
- **Redirect URLs thêm**: `http://localhost:3000/**`

---

## 💻 PHASE 2: CODE CỐT LÕI

### Bước 2.1 — `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEpisode(current: string, total: string): string {
  if (!current) return ''
  if (current.toLowerCase().includes('full') || current.toLowerCase().includes('hoàn')) {
    return 'Hoàn tất'
  }
  return `${current}${total ? `/${total}` : ''}`
}

export function getImageUrl(url: string): string {
  if (!url) return '/placeholder-movie.jpg'
  if (url.startsWith('http')) {
    return `https://phimapi.com/image.php?url=${encodeURIComponent(url)}`
  }
  return url
}
```

### Bước 2.2 — `src/lib/kkphim/types.ts`

```typescript
export interface Movie {
  _id: string
  name: string
  origin_name: string
  slug: string
  type: 'series' | 'single'
  thumb_url: string
  poster_url: string
  year: number
  quality: string
  lang: string
  episode_current: string
  episode_total: string
  time: string
  status: string
  sub_docquyen: boolean
  chieurap: boolean
  category: Category[]
  country: Country[]
  actor?: string[]
  director?: string[]
  content?: string
  tmdb?: {
    id: string
    type: string
    vote_average: number
    vote_count: number
  }
  modified: {
    time: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Country {
  id: string
  name: string
  slug: string
}

export interface Episode {
  server_name: string
  server_data: EpisodeItem[]
}

export interface EpisodeItem {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface MovieListResponse {
  status: boolean
  msg: string
  data: {
    items: Movie[]
    params: {
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
  }
}

export interface MovieDetailResponse {
  status: boolean
  msg: string
  movie: Movie & {
    content: string
    actor: string[]
    director: string[]
  }
  episodes: Episode[]
}

export interface SearchResponse {
  status: boolean
  msg: string
  data: {
    items: Movie[]
    params: {
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
  }
}
```

### Bước 2.3 — `src/lib/kkphim/api.ts`

```typescript
const BASE_URL = 'https://phimapi.com'

export async function getNewMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/danh-sach/phim-moi-cap-nhat-v2?page=${page}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải danh sách phim')
  return res.json()
}

export async function getMovieDetail(slug: string) {
  const res = await fetch(
    `${BASE_URL}/phim/${slug}`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error('Không thể tải thông tin phim')
  return res.json()
}

export async function getMovieList(params: {
  type: string
  page?: number
  category?: string
  country?: string
  year?: string
  sort_field?: string
  sort_type?: string
  sort_lang?: string
  limit?: number
}) {
  const { type, page = 1, category, country, year, sort_field = 'modified.time', sort_type = 'desc', sort_lang, limit = 24 } = params
  
  const query = new URLSearchParams({
    page: String(page),
    sort_field,
    sort_type,
    limit: String(limit),
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
    ...(sort_lang && { sort_lang }),
  })

  const res = await fetch(
    `${BASE_URL}/v1/api/danh-sach/${type}?${query}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải danh sách phim')
  return res.json()
}

export async function searchMovies(params: {
  keyword: string
  page?: number
  category?: string
  country?: string
  year?: string
  limit?: number
}) {
  const { keyword, page = 1, category, country, year, limit = 24 } = params

  const query = new URLSearchParams({
    keyword,
    page: String(page),
    limit: String(limit),
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
  })

  const res = await fetch(
    `${BASE_URL}/v1/api/tim-kiem?${query}`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error('Lỗi tìm kiếm')
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/the-loai`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error('Không thể tải thể loại')
  return res.json()
}

export async function getCountries() {
  const res = await fetch(`${BASE_URL}/quoc-gia`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error('Không thể tải quốc gia')
  return res.json()
}

export async function getMoviesByCategory(slug: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/v1/api/the-loai/${slug}?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải phim theo thể loại')
  return res.json()
}

export async function getMoviesByCountry(slug: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải phim theo quốc gia')
  return res.json()
}
```

### Bước 2.4 — Supabase Client Setup

**`src/lib/supabase/client.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**`src/lib/supabase/middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')

  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**`src/middleware.ts`**
```typescript
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
```

---

## 🔐 PHASE 3: AUTHENTICATION

### Bước 3.1 — `src/hooks/useAuth.ts`

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    setError(null)
    // Email confirmation đã bị tắt trong Supabase Dashboard
    // nên không cần emailRedirectTo — user có thể đăng nhập ngay
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    setLoading(false)
    if (error) {
      setError(mapAuthError(error.message))
      return false
    }
    return true
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(mapAuthError(error.message))
      return false
    }
    router.push('/')
    router.refresh()
    return true
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return { signUp, signIn, signOut, loading, error }
}

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email hoặc mật khẩu không đúng'
  if (message.includes('Email not confirmed')) return 'Vui lòng xác nhận email của bạn'
  if (message.includes('User already registered')) return 'Email này đã được đăng ký'
  if (message.includes('Password should be')) return 'Mật khẩu phải có ít nhất 6 ký tự'
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.'
}
```

### Bước 3.2 — `src/app/(auth)/register/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { signUp, loading, error } = useAuth()
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    const ok = await signUp(data.email, data.password, data.fullName)
    if (ok) {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Film className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>Tạo tài khoản để xem phim cùng gia đình</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center text-green-600 py-4">
              ✅ Đăng ký thành công! Đang chuyển đến trang đăng nhập...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" placeholder="Nguyễn Văn A" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### Bước 3.3 — `src/app/(auth)/login/page.tsx`

Tương tự register nhưng không có `fullName` và `confirmPassword`.
Schema Zod: chỉ `email` + `password`.
Gọi `signIn()` từ `useAuth`.
Sau login thành công: không cần redirect thủ công (useAuth đã xử lý).

---

## 🎬 PHASE 4: LAYOUT & COMPONENTS

### Bước 4.1 — `src/app/layout.tsx` (Root Layout)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | CL Film',
    default: 'CL Film — Xem Phim Cùng Gia Đình',
  },
  description: 'Website xem phim trực tuyến miễn phí dành cho gia đình',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Bước 4.2 — `src/app/(main)/layout.tsx` (Main Layout)

Server component lấy user từ Supabase, truyền vào Header.

```typescript
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

### Bước 4.3 — `src/components/layout/Header.tsx`

```typescript
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Film, Search, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useState, type User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">CL Film</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {[
              { href: '/danh-sach/phim-bo', label: 'Phim Bộ' },
              { href: '/danh-sach/phim-le', label: 'Phim Lẻ' },
              { href: '/danh-sach/hoat-hinh', label: 'Hoạt Hình' },
              { href: '/danh-sach/tv-shows', label: 'TV Shows' },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm">{item.label}</Button>
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-md ml-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm phim..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User menu */}
          {user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
```

### Bước 4.4 — `src/components/movies/MovieCard.tsx`

```typescript
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, formatEpisode } from '@/lib/utils'
import type { Movie } from '@/lib/kkphim/types'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/phim/${movie.slug}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
        <Image
          src={getImageUrl(movie.thumb_url || movie.poster_url)}
          alt={movie.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {movie.quality && (
            <Badge variant="secondary" className="text-xs bg-yellow-500 text-black border-0">
              {movie.quality}
            </Badge>
          )}
          {movie.lang && (
            <Badge variant="secondary" className="text-xs">
              {movie.lang}
            </Badge>
          )}
        </div>

        {/* Episode info */}
        {movie.episode_current && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
              {formatEpisode(movie.episode_current, movie.episode_total)}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {movie.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.origin_name && movie.origin_name !== movie.name ? movie.origin_name : movie.year}
        </p>
      </div>
    </Link>
  )
}
```

### Bước 4.5 — `src/components/movies/MovieGrid.tsx`

```typescript
import { MovieCard } from './MovieCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Movie } from '@/lib/kkphim/types'

interface MovieGridProps {
  movies: Movie[]
  loading?: boolean
}

export function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!movies?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">Không tìm thấy phim nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map(movie => (
        <MovieCard key={movie._id || movie.slug} movie={movie} />
      ))}
    </div>
  )
}
```

---

## 📄 PHASE 5: PAGES

### Bước 5.1 — `src/app/(main)/page.tsx` (Trang Chủ)

```typescript
import { getNewMovies, getMovieList } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { MovieSection } from '@/components/movies/MovieSection'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const [newMovies, seriesMovies, singleMovies, animeMovies] = await Promise.allSettled([
    getNewMovies(1),
    getMovieList({ type: 'phim-bo', limit: 12 }),
    getMovieList({ type: 'phim-le', limit: 12 }),
    getMovieList({ type: 'hoat-hinh', limit: 12 }),
  ])

  const newItems = newMovies.status === 'fulfilled' ? newMovies.value?.items || [] : []
  const seriesItems = seriesMovies.status === 'fulfilled' ? seriesMovies.value?.data?.items || [] : []
  const singleItems = singleMovies.status === 'fulfilled' ? singleMovies.value?.data?.items || [] : []
  const animeItems = animeMovies.status === 'fulfilled' ? animeMovies.value?.data?.items || [] : []

  return (
    <div className="space-y-10">
      {/* Phim mới cập nhật */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🔥 Phim Mới Cập Nhật</h2>
          <Link href="/danh-sach/phim-moi">
            <Button variant="outline" size="sm">Xem tất cả</Button>
          </Link>
        </div>
        <MovieGrid movies={newItems.slice(0, 24)} />
      </section>

      {/* Phim Bộ */}
      {seriesItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📺 Phim Bộ</h2>
            <Link href="/danh-sach/phim-bo">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <MovieGrid movies={seriesItems} />
        </section>
      )}

      {/* Phim Lẻ */}
      {singleItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🎬 Phim Lẻ</h2>
            <Link href="/danh-sach/phim-le">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <MovieGrid movies={singleItems} />
        </section>
      )}

      {/* Hoạt Hình */}
      {animeItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">✨ Hoạt Hình</h2>
            <Link href="/danh-sach/hoat-hinh">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <MovieGrid movies={animeItems} />
        </section>
      )}
    </div>
  )
}
```

### Bước 5.2 — `src/app/(main)/phim/[slug]/page.tsx` (Chi Tiết Phim)

Server component. Gọi `getMovieDetail(slug)`. Hiển thị:
- Poster ảnh (`poster_url`), thumbnail (`thumb_url`)
- Tên phim (`name`), tên gốc (`origin_name`)
- Rating TMDB (`movie.tmdb.vote_average`)
- Năm, chất lượng, ngôn ngữ, thể loại (link đến `/the-loai/[slug]`), quốc gia (link đến `/quoc-gia/[slug]`)
- Đạo diễn, diễn viên
- Nội dung (`content` — parse HTML an toàn với `dangerouslySetInnerHTML` hoặc `html-react-parser`)
- Trạng thái `episode_current`
- Nút `Xem Phim` → link đến `/phim/[slug]/xem?server=0&tap=0`
- Nếu phim bộ: hiển thị `EpisodeList` để chọn tập

```typescript
import { getMovieDetail } from '@/lib/kkphim/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EpisodeList } from '@/components/movies/EpisodeList'
import { getImageUrl } from '@/lib/utils'
import { Star, Play, Clock, Globe } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const data = await getMovieDetail(params.slug)
    return {
      title: data.movie?.name || 'Phim',
      description: data.movie?.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    }
  } catch {
    return { title: 'Phim' }
  }
}

export default async function MovieDetailPage({ params }: { params: { slug: string } }) {
  let data
  try {
    data = await getMovieDetail(params.slug)
  } catch {
    notFound()
  }

  if (!data?.movie) notFound()

  const { movie, episodes } = data

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
            <Image
              src={getImageUrl(movie.poster_url || movie.thumb_url)}
              alt={movie.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
          <Link href={`/phim/${params.slug}/xem?server=0&tap=0`}>
            <Button className="w-full mt-4 gap-2" size="lg">
              <Play className="h-5 w-5" />
              Xem Phim
            </Button>
          </Link>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{movie.name}</h1>
            <p className="text-muted-foreground mt-1">{movie.origin_name}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            {movie.tmdb?.vote_average > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {movie.tmdb.vote_average.toFixed(1)}
              </Badge>
            )}
            <Badge>{movie.year}</Badge>
            {movie.quality && <Badge variant="outline">{movie.quality}</Badge>}
            {movie.lang && <Badge variant="outline">{movie.lang}</Badge>}
            {movie.episode_current && (
              <Badge className="bg-green-600">{movie.episode_current}</Badge>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {movie.category?.map(cat => (
              <Link key={cat.id} href={`/the-loai/${cat.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Country */}
          <div className="flex gap-2 flex-wrap">
            {movie.country?.map(c => (
              <Link key={c.id} href={`/quoc-gia/${c.slug}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Description */}
          {movie.content && (
            <div
              className="text-muted-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              // isomorphic-dompurify chạy cả server và client — an toàn với XSS
              dangerouslySetInnerHTML={{
                __html: require('isomorphic-dompurify').sanitize(movie.content)
              }}
            />
          )}

          {/* Cast */}
          {movie.actor?.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Diễn viên: </span>
              <span className="text-muted-foreground">{movie.actor.slice(0, 5).join(', ')}</span>
            </p>
          )}
          {movie.director?.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Đạo diễn: </span>
              <span className="text-muted-foreground">{movie.director.join(', ')}</span>
            </p>
          )}
        </div>
      </div>

      {/* Episodes */}
      {episodes?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Danh sách tập</h2>
          <EpisodeList episodes={episodes} slug={params.slug} />
        </div>
      )}
    </div>
  )
}
```

### Bước 5.3 — `src/components/movies/EpisodeList.tsx`

```typescript
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Episode } from '@/lib/kkphim/types'

interface EpisodeListProps {
  episodes: Episode[]
  slug: string
}

export function EpisodeList({ episodes, slug }: EpisodeListProps) {
  return (
    <Tabs defaultValue="0">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
        {episodes.map((server, i) => (
          <TabsTrigger key={i} value={String(i)}>
            {server.server_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {episodes.map((server, serverIdx) => (
        <TabsContent key={serverIdx} value={String(serverIdx)}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {server.server_data.map((ep, epIdx) => (
              <Link
                key={epIdx}
                href={`/phim/${slug}/xem?server=${serverIdx}&tap=${epIdx}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  {ep.name}
                </Button>
              </Link>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
```

### Bước 5.4 — `src/app/(main)/phim/[slug]/xem/page.tsx` (Trang Xem Phim)

```typescript
import { getMovieDetail } from '@/lib/kkphim/api'
import { notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { EpisodeList } from '@/components/movies/EpisodeList'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WatchPageProps {
  params: { slug: string }
  searchParams: { server?: string; tap?: string }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  let data
  try {
    data = await getMovieDetail(params.slug)
  } catch {
    notFound()
  }

  if (!data?.movie || !data?.episodes?.length) notFound()

  const { movie, episodes } = data
  const serverIdx = parseInt(searchParams.server || '0', 10)
  const episodeIdx = parseInt(searchParams.tap || '0', 10)

  const currentServer = episodes[serverIdx] || episodes[0]
  const currentEpisode = currentServer?.server_data?.[episodeIdx] || currentServer?.server_data?.[0]

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href={`/phim/${params.slug}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            {movie.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{currentEpisode?.name || 'Xem phim'}</span>
      </div>

      {/* Player */}
      <VideoPlayer
        embedUrl={currentEpisode?.link_embed}
        m3u8Url={currentEpisode?.link_m3u8}
        title={`${movie.name} - ${currentEpisode?.name || ''}`}
      />

      {/* Episode List */}
      {episodes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Chọn tập</h3>
          <EpisodeList episodes={episodes} slug={params.slug} />
        </div>
      )}
    </div>
  )
}
```

### Bước 5.5 — `src/components/player/VideoPlayer.tsx`

> Chiến lược: Ưu tiên **iframe embed** (đơn giản, hoạt động tốt). Nếu embed lỗi hoặc user muốn,
> fallback sang **HLS native player** dùng `hls.js`. Cả 2 mode có thể switch qua lại.

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  embedUrl?: string
  m3u8Url?: string
  title?: string
}

type PlayerMode = 'embed' | 'hls' | 'error'

export function VideoPlayer({ embedUrl, m3u8Url, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<PlayerMode>(embedUrl ? 'embed' : 'hls')
  const hlsRef = useRef<any>(null)

  // Cleanup HLS instance khi unmount hoặc đổi mode
  useEffect(() => {
    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [])

  // Khởi tạo HLS khi mode = 'hls'
  useEffect(() => {
    if (mode !== 'hls' || !m3u8Url || !videoRef.current) return

    // Cleanup instance cũ trước
    hlsRef.current?.destroy()
    hlsRef.current = null

    const video = videoRef.current

    // Dynamic import để tránh SSR issues
    import('hls.js').then(({ default: Hls }) => {
      if (!video) return

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,  // Tắt worker để tránh lỗi trong một số môi trường
          maxBufferLength: 30,
        })
        hlsRef.current = hls
        hls.loadSource(m3u8Url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {}) // Autoplay có thể bị browser chặn
        })
        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) {
            console.error('[HLS] Fatal error:', data.type)
            setMode('error')
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS — Safari / iOS
        video.src = m3u8Url
        video.play().catch(() => {})
      } else {
        // Trình duyệt không hỗ trợ HLS
        setMode('error')
      }
    }).catch(() => setMode('error'))
  }, [mode, m3u8Url])

  // --- Render: Embed mode ---
  if (mode === 'embed' && embedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
        />
        {/* Nút chuyển sang HLS nếu có m3u8 */}
        {m3u8Url && (
          <button
            onClick={() => setMode('hls')}
            className="absolute bottom-3 right-3 text-xs bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-md z-10 transition-colors"
          >
            🎬 Player thay thế
          </button>
        )}
      </div>
    )
  }

  // --- Render: HLS mode ---
  if (mode === 'hls' && m3u8Url) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          title={title}
        />
        {/* Nút quay lại embed */}
        {embedUrl && (
          <button
            onClick={() => {
              hlsRef.current?.destroy()
              hlsRef.current = null
              setMode('embed')
            }}
            className="absolute top-3 right-3 text-xs bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-md z-10 transition-colors"
          >
            ↩ Dùng embed player
          </button>
        )}
      </div>
    )
  }

  // --- Render: Error / No source ---
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-white text-lg">⚠️ Không thể tải video</p>
      <p className="text-gray-400 text-sm">Hãy thử server khác hoặc làm mới trang</p>
      <div className="flex gap-3">
        {embedUrl && (
          <button
            onClick={() => setMode('embed')}
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Dùng Embed Player
          </button>
        )}
        {m3u8Url && (
          <button
            onClick={() => setMode('hls')}
            className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Thử lại HLS
          </button>
        )}
      </div>
    </div>
  )
}
```

### Bước 5.6 — `src/app/(main)/tim-kiem/page.tsx` (Tìm Kiếm)

Server component. Đọc `searchParams.q`. Gọi `searchMovies({ keyword: q })`. Hiển thị kết quả với `MovieGrid`.

```typescript
import { searchMovies } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { SearchBar } from '@/components/search/SearchBar'

interface SearchPageProps {
  searchParams: { q?: string; page?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)

  let movies = []
  let totalPages = 1

  if (query) {
    try {
      const data = await searchMovies({ keyword: query, page, limit: 24 })
      movies = data?.data?.items || []
      totalPages = data?.data?.params?.pagination?.totalPages || 1
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Kết quả cho "${query}"` : 'Tìm kiếm phim'}
        </h1>
        <SearchBar defaultValue={query} />
      </div>

      {query && <MovieGrid movies={movies} />}

      {!query && (
        <p className="text-center text-muted-foreground py-16">
          Nhập tên phim để tìm kiếm
        </p>
      )}
    </div>
  )
}
```

### Bước 5.7 — `src/components/search/SearchBar.tsx`

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Nhập tên phim, diễn viên..."
        className="flex-1"
      />
      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" />
        Tìm
      </Button>
    </form>
  )
}
```

### Bước 5.8 — `src/app/(main)/danh-sach/[type]/page.tsx`

Server component. Map `type` param → hiển thị tên tiếng Việt.

```typescript
import { getMovieList, getNewMovies } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { notFound } from 'next/navigation'

const TYPE_LABELS: Record<string, string> = {
  'phim-bo': 'Phim Bộ',
  'phim-le': 'Phim Lẻ',
  'tv-shows': 'TV Shows',
  'hoat-hinh': 'Hoạt Hình',
  'phim-vietsub': 'Phim Vietsub',
  'phim-long-tieng': 'Phim Lồng Tiếng',
  'phim-moi': 'Phim Mới Cập Nhật',
}

interface Props {
  params: { type: string }
  searchParams: { page?: string }
}

export default async function ListPage({ params, searchParams }: Props) {
  const label = TYPE_LABELS[params.type]
  if (!label) notFound()

  const page = parseInt(searchParams.page || '1', 10)
  let movies = []

  try {
    if (params.type === 'phim-moi') {
      const data = await getNewMovies(page)
      movies = data?.items || []
    } else {
      const data = await getMovieList({ type: params.type, page, limit: 24 })
      movies = data?.data?.items || []
    }
  } catch {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{label}</h1>
      <MovieGrid movies={movies} />
    </div>
  )
}
```

### Bước 5.9 — Các trang thể loại và quốc gia

**`src/app/(main)/the-loai/[slug]/page.tsx`**:

```typescript
import { getMoviesByCategory } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Thể loại: ${params.slug.replace(/-/g, ' ')}`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || '1', 10)
  let movies: any[] = []
  let categoryName = params.slug.replace(/-/g, ' ')
  let totalPages = 1

  try {
    const data = await getMoviesByCategory(params.slug, page)
    movies = data?.data?.items || []
    // API trả về tên thể loại trong breadCrumb hoặc type_list
    categoryName = data?.data?.APP?.name || categoryName
    totalPages = data?.data?.params?.pagination?.totalPages || 1
  } catch {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Trang chủ
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium capitalize">{categoryName}</span>
      </div>

      <h1 className="text-2xl font-bold capitalize">Thể loại: {categoryName}</h1>

      <MovieGrid movies={movies} />

      {/* Phân trang đơn giản */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {page > 1 && (
            <Link href={`/the-loai/${params.slug}?page=${page - 1}`}>
              <Button variant="outline" size="sm">← Trang trước</Button>
            </Link>
          )}
          <span className="flex items-center text-sm text-muted-foreground px-4">
            Trang {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/the-loai/${params.slug}?page=${page + 1}`}>
              <Button variant="outline" size="sm">Trang sau →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
```

**`src/app/(main)/quoc-gia/[slug]/page.tsx`**:

```typescript
import { getMoviesByCountry } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Phim ${params.slug.replace(/-/g, ' ')}`,
  }
}

export default async function CountryPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || '1', 10)
  let movies: any[] = []
  let countryName = params.slug.replace(/-/g, ' ')
  let totalPages = 1

  try {
    const data = await getMoviesByCountry(params.slug, page)
    movies = data?.data?.items || []
    countryName = data?.data?.APP?.name || countryName
    totalPages = data?.data?.params?.pagination?.totalPages || 1
  } catch {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Trang chủ
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium capitalize">Quốc gia: {countryName}</span>
      </div>

      <h1 className="text-2xl font-bold capitalize">Phim {countryName}</h1>

      <MovieGrid movies={movies} />

      {/* Phân trang đơn giản */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {page > 1 && (
            <Link href={`/quoc-gia/${params.slug}?page=${page - 1}`}>
              <Button variant="outline" size="sm">← Trang trước</Button>
            </Link>
          )}
          <span className="flex items-center text-sm text-muted-foreground px-4">
            Trang {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/quoc-gia/${params.slug}?page=${page + 1}`}>
              <Button variant="outline" size="sm">Trang sau →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
```

### Bước 5.10 — `src/app/not-found.tsx`

```typescript
import Link from 'next/link'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
      <Film className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Trang bạn tìm không tồn tại</p>
      <Link href="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  )
}
```

---

## ⚙️ PHASE 6: CONFIGURATION

### Bước 6.1 — `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // phimapi.com image proxy
    remotePatterns: [
      { protocol: 'https', hostname: 'phimimg.com' },
      { protocol: 'https', hostname: 'phimapi.com' },
      { protocol: 'https', hostname: 'img.ophim.live' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### Bước 6.2 — `src/app/(main)/layout.tsx` Footer

Tạo `src/components/layout/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 CL Film — Website xem phim dành cho gia đình 🎬</p>
        <p className="mt-1 text-xs">Dữ liệu phim từ KKPhim. Chỉ dành cho mục đích cá nhân.</p>
      </div>
    </footer>
  )
}
```

---

## 🧪 PHASE 7: TESTING

### Bước 7.1 — Cài Vitest

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

Tạo `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

Tạo `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

### Bước 7.2 — Test mẫu cho utils

```typescript
// tests/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatEpisode, getImageUrl } from '@/lib/utils'

describe('formatEpisode', () => {
  it('returns "Hoàn tất" for completed series', () => {
    expect(formatEpisode('Hoàn Tất (24/24)', '24')).toBe('Hoàn tất')
  })
  it('formats episode with total', () => {
    expect(formatEpisode('Tập 5', '24')).toBe('Tập 5/24')
  })
})

describe('getImageUrl', () => {
  it('returns placeholder for empty URL', () => {
    expect(getImageUrl('')).toBe('/placeholder-movie.jpg')
  })
  it('proxies external URLs through phimapi', () => {
    const url = getImageUrl('https://phimimg.com/image.jpg')
    expect(url).toContain('phimapi.com/image.php')
  })
})
```

### Bước 7.3 — Cài Playwright

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

Tạo `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
})
```

Tạo test E2E mẫu `tests/e2e/auth.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test('register and login flow', async ({ page }) => {
  // Register
  await page.goto('/register')
  await page.fill('[id="fullName"]', 'Test User')
  await page.fill('[id="email"]', `test${Date.now()}@example.com`)
  await page.fill('[id="password"]', 'password123')
  await page.fill('[id="confirmPassword"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Đăng ký thành công')).toBeVisible({ timeout: 5000 })
})

test('home page loads movies', async ({ page }) => {
  // Login first
  await page.goto('/login')
  // ... login logic
  await page.goto('/')
  await expect(page.locator('text=Phim Mới Cập Nhật')).toBeVisible()
})
```

---

## 📦 PHASE 8: PACKAGE.JSON SCRIPTS

Thêm vào `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

---

## ✅ CHECKLIST HOÀN THÀNH

### Sau mỗi phase, kiểm tra:
- [ ] `npm run type-check` — không có TypeScript error
- [ ] `npm run lint` — không có lint error
- [ ] `npm run dev` — chạy được, không có console error
- [ ] Test thủ công flow cơ bản

### Cuối dự án:
- [ ] Đăng ký tài khoản → thành công
- [ ] Đăng nhập → vào trang chủ
- [ ] Trang chủ load danh sách phim
- [ ] Click phim → xem chi tiết
- [ ] Click xem → player load
- [ ] Tìm kiếm tên phim → hiển thị kết quả
- [ ] Đăng xuất → về trang login
- [ ] Truy cập route khi chưa login → redirect login
- [ ] `npm run build` — build thành công

---

## 🚀 DEPLOY LÊN VERCEL

```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel

# Thêm env variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add CRON_SECRET
vercel env add NEXT_PUBLIC_APP_URL      # = https://your-app.vercel.app
vercel env add NEXT_PUBLIC_APP_NAME     # = CL Film

# Deploy production
vercel --prod
```

Sau khi có URL production, update trong Supabase Dashboard → Authentication → Settings → Redirect URLs.

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Đừng commit `.env.local`** — file đã có trong `.gitignore` của Next.js, kiểm tra lại để chắc chắn.
2. **`SUPABASE_SERVICE_ROLE_KEY` chỉ dùng phía server** — không bao giờ dùng trong client component.
3. **Image optimization** — dùng `unoptimized: true` vì ảnh đã được proxy qua phimapi.com/image.php thành WebP.
4. **CORS** — không cần cấu hình thêm vì Next.js API Routes chạy phía server.
5. **`RESEND_API_KEY`** — dùng cho tính năng quên mật khẩu (password reset), implement sau khi auth cơ bản hoạt động.
6. **`CRON_SECRET`** — dùng cho GitHub Actions sync định kỳ (optional, implement sau).
7. **phimapi.com** — nếu site chậm hoặc timeout, dùng `next: { revalidate: N }` để cache.

---

*Thực hiện từng Phase theo thứ tự. Không skip Phase nào.*
*Sau mỗi Phase: chạy `npm run dev` và test thủ công trước khi tiếp tục.*