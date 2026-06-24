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
