import { getMovieDetail } from '@/lib/kkphim/api'
import { notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { EpisodeList } from '@/components/movies/EpisodeList'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WatchPageProps {
  params: { slug: string }
  searchParams: { server?: string; tap?: string }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  let data
  try {
    data = await getMovieDetail(params.slug)
  } catch {
    notFound()
  }

  if (!data?.movie || !data?.episodes?.length) notFound()

  const { movie, episodes } = data
  const serverIdx = parseInt(searchParams.server || '0', 10)
  const episodeIdx = parseInt(searchParams.tap || '0', 10)

  const currentServer = episodes[serverIdx] || episodes[0]
  const currentEpisode = currentServer?.server_data?.[episodeIdx] || currentServer?.server_data?.[0]

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href={`/phim/${params.slug}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            {movie.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{currentEpisode?.name || 'Xem phim'}</span>
      </div>

      {/* Player */}
      <VideoPlayer
        embedUrl={currentEpisode?.link_embed}
        m3u8Url={currentEpisode?.link_m3u8}
        title={`${movie.name} - ${currentEpisode?.name || ''}`}
      />

      {/* Episode List */}
      {episodes.length > 0 && (
        <div className="pt-6">
          <h3 className="font-semibold mb-3">Chọn tập</h3>
          <EpisodeList episodes={episodes} slug={params.slug} />
        </div>
      )}
    </div>
  )
}
