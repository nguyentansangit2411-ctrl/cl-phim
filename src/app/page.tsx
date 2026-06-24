import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getNewMovies, getMovieList } from '@/lib/kkphim/api'
import { MovieGrid } from '@/components/movies/MovieGrid'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">🔥 Phim Mới Cập Nhật</h2>
              <Link href="/danh-sach/phim-moi">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
            <MovieGrid movies={newItems.slice(0, 24)} />
          </section>

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
      </main>
      <Footer />
    </div>
  )
}
