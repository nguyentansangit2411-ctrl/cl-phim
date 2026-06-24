import { getMovieDetail } from '@/lib/kkphim/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EpisodeList } from '@/components/movies/EpisodeList'
import { getImageUrl, sanitizeHtml } from '@/lib/utils'
import { Star, Play } from 'lucide-react'
import type { MovieDetailResponse, Category, Country } from '@/lib/kkphim/types'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const data = (await getMovieDetail(params.slug)) as MovieDetailResponse
    return {
      title: data.movie?.name || 'Phim',
      description: data.movie?.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    }
  } catch {
    return { title: 'Phim' }
  }
}

export default async function MovieDetailPage({ params }: { params: { slug: string } }) {
  let data: MovieDetailResponse
  try {
    data = (await getMovieDetail(params.slug)) as MovieDetailResponse
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
            {movie.tmdb && movie.tmdb.vote_average > 0 && (
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
            {movie.category?.map((cat: Category) => (
              <Link key={cat.id} href={`/the-loai/${cat.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Country */}
          <div className="flex gap-2 flex-wrap">
            {movie.country?.map((c: Country) => (
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
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(movie.content)
              }}
            />
          )}

          {/* Cast */}
          {movie.actor && movie.actor.length > 0 && movie.actor[0] !== "" && (
            <p className="text-sm">
              <span className="font-medium">Diễn viên: </span>
              <span className="text-muted-foreground">{movie.actor.slice(0, 5).join(', ')}</span>
            </p>
          )}
          {movie.director && movie.director.length > 0 && movie.director[0] !== "" && (
            <p className="text-sm">
              <span className="font-medium">Đạo diễn: </span>
              <span className="text-muted-foreground">{movie.director.join(', ')}</span>
            </p>
          )}
        </div>
      </div>

      {/* Episodes */}
      {episodes?.length > 0 && episodes[0]?.server_data?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Danh sách tập</h2>
          <EpisodeList episodes={episodes} slug={params.slug} />
        </div>
      )}
    </div>
  )
}
