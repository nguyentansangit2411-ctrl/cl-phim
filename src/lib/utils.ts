import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEpisode(current: string, total: string): string {
  if (!current) return ''
  if (current.toLowerCase().includes('full') || current.toLowerCase().includes('hoàn')) {
    return 'Hoàn tất'
  }
  return `${current}${total ? `/${total}` : ''}`
}

export function getImageUrl(url: string): string {
  if (!url) return '/placeholder-movie.jpg'
  if (url.startsWith('http')) {
    return `https://phimapi.com/image.php?url=${encodeURIComponent(url)}`
  }
  return url
}
