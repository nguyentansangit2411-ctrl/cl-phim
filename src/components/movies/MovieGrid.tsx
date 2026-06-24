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
