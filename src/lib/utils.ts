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

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*".*?"/gi, '')
    .replace(/on\w+\s*=\s*'.*?'/gi, '')
    .replace(/javascript\s*:/gi, '')
}
