import { describe, it, expect } from 'vitest'
import { formatEpisode, getImageUrl } from '@/lib/utils'

describe('formatEpisode', () => {
  it('returns "Hoàn tất" for completed series', () => {
    expect(formatEpisode('Hoàn Tất (24/24)', '24')).toBe('Hoàn tất')
  })
  it('formats episode with total', () => {
    expect(formatEpisode('Tập 5', '24')).toBe('Tập 5/24')
  })
})

describe('getImageUrl', () => {
  it('returns placeholder for empty URL', () => {
    expect(getImageUrl('')).toBe('/placeholder-movie.jpg')
  })
  it('proxies external URLs through phimapi', () => {
    const url = getImageUrl('https://phimimg.com/image.jpg')
    expect(url).toContain('phimapi.com/image.php')
  })
})
