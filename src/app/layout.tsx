import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | CL Film',
    default: 'CL Film — Xem Phim Cùng Gia Đình',
  },
  description: 'Website xem phim trực tuyến miễn phí dành cho gia đình',
  icons: {
    icon: '/logo-badmovie.png',
    apple: '/logo-badmovie.png',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
