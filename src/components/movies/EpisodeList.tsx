'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Episode } from '@/lib/kkphim/types'

interface EpisodeListProps {
  episodes: Episode[]
  slug: string
}

export function EpisodeList({ episodes, slug }: EpisodeListProps) {
  return (
    <Tabs defaultValue="0">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
        {episodes.map((server, i) => (
          <TabsTrigger key={i} value={String(i)}>
            {server.server_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {episodes.map((server, serverIdx) => (
        <TabsContent key={serverIdx} value={String(serverIdx)}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {server.server_data.map((ep, epIdx) => (
              <Link
                key={epIdx}
                href={`/phim/${slug}/xem?server=${serverIdx}&tap=${epIdx}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  {ep.name}
                </Button>
              </Link>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
