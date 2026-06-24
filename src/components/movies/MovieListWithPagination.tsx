'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MovieCard } from './MovieCard'
import { getMovieList, getNewMovies } from '@/lib/kkphim/api'
import { Button } from '@/components/ui/button'
import type { Movie } from '@/lib/kkphim/types'

interface MovieListWithPaginationProps {
  initialMovies: Movie[]
  type: string
}

const ITEMS_PER_PAGE = 12

export function MovieListWithPagination({ initialMovies, type }: MovieListWithPaginationProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE)
  const [apiPage, setApiPage] = useState(1) // Current page fetched from API
  const [hasMoreApi, setHasMoreApi] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  // Current logical page (1 page = 12 items)
  const currentPage = Math.ceil(displayedCount / ITEMS_PER_PAGE)

  // Load more function
  const handleLoadMore = useCallback(async () => {
    if (loading) return

    const nextDisplayedCount = displayedCount + ITEMS_PER_PAGE

    // If we don't have enough movies in the state, fetch the next page from the API
    if (nextDisplayedCount > movies.length && hasMoreApi) {
      setLoading(true)
      try {
        const nextApiPage = apiPage + 1
        let newItems: Movie[] = []
        if (type === 'phim-moi') {
          const data = await getNewMovies(nextApiPage)
          newItems = data?.items || []
        } else {
          const data = await getMovieList({ type, page: nextApiPage, limit: 24 })
          newItems = data?.data?.items || []
        }

        if (newItems.length === 0) {
          setHasMoreApi(false)
        } else {
          setMovies(prev => [...prev, ...newItems])
          setApiPage(nextApiPage)
        }
      } catch (err) {
        console.error('Error fetching next page:', err)
      } finally {
        setLoading(false)
      }
    }

    setDisplayedCount(nextDisplayedCount)
  }, [loading, displayedCount, movies.length, hasMoreApi, apiPage, type])

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    // Only auto-scroll for page 1 and page 2 (transitions from 1->2 and 2->3)
    if (currentPage >= 3) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentObserverTarget = observerRef.current
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget)
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget)
      }
    }
  }, [currentPage, loading, handleLoadMore])

  const displayedMovies = movies.slice(0, displayedCount)
  const hasMoreToDisplay = displayedCount < movies.length || hasMoreApi

  return (
    <div className="space-y-6">
      {/* Grid of movies: keep the exact grid classes from MovieGrid.tsx */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedMovies.map((movie, idx) => (
          <MovieCard key={movie._id || `${movie.slug}-${idx}`} movie={movie} />
        ))}
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-center py-4 text-muted-foreground">
          Đang tải thêm...
        </div>
      )}

      {/* Element to observe for page 1 and 2 */}
      {currentPage < 3 && hasMoreToDisplay && !loading && (
        <div ref={observerRef} className="h-10 w-full" />
      )}

      {/* Load more button for page 3 onwards */}
      {currentPage >= 3 && hasMoreToDisplay && !loading && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleLoadMore} variant="outline" className="w-full max-w-xs">
            Xem thêm phim
          </Button>
        </div>
      )}
    </div>
  )
}
