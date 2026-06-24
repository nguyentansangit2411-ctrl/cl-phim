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
