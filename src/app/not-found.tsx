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
