import { getMovieList, getNewMovies } from '@/lib/kkphim/api'
import { MovieListWithPagination } from '@/components/movies/MovieListWithPagination'
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
      <MovieListWithPagination initialMovies={movies} type={params.type} />
    </div>
  )
}
