'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, formatEpisode } from '@/lib/utils'
import type { Movie } from '@/lib/kkphim/types'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/phim/${movie.slug}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
        <Image
          src={getImageUrl(movie.thumb_url || movie.poster_url)}
          alt={movie.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized
          referrerPolicy="no-referrer"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {movie.quality && (
            <Badge variant="secondary" className="text-xs bg-yellow-500 text-black border-0">
              {movie.quality}
            </Badge>
          )}
          {movie.lang && (
            <Badge variant="secondary" className="text-xs">
              {movie.lang}
            </Badge>
          )}
        </div>

        {/* Episode info */}
        {movie.episode_current && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
              {formatEpisode(movie.episode_current, movie.episode_total)}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {movie.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.origin_name && movie.origin_name !== movie.name ? movie.origin_name : movie.year}
        </p>
      </div>
    </Link>
  )
}
