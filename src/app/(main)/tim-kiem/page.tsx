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
