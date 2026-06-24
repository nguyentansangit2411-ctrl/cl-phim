import { getNewMovies, getMovieList } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
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
