'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  embedUrl?: string
  m3u8Url?: string
  title?: string
}

type PlayerMode = 'embed' | 'hls' | 'error'

export function VideoPlayer({ embedUrl, m3u8Url, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<PlayerMode>(embedUrl ? 'embed' : 'hls')
  const hlsRef = useRef<any>(null)

  // Cleanup HLS instance khi unmount hoặc đổi mode
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [])

  // Khởi tạo HLS khi mode = 'hls'
  useEffect(() => {
    if (mode !== 'hls' || !m3u8Url || !videoRef.current) return

    // Cleanup instance cũ trước
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const video = videoRef.current

    // Dynamic import để tránh SSR issues
    import('hls.js').then(({ default: Hls }) => {
      if (!video) return

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,  // Tắt worker để tránh lỗi trong một số môi trường
          maxBufferLength: 30,
        })
        hlsRef.current = hls
        hls.loadSource(m3u8Url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {}) // Autoplay có thể bị browser chặn
        })
        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) {
            console.error('[HLS] Fatal error:', data.type)
            setMode('error')
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS — Safari / iOS
        video.src = m3u8Url
        video.play().catch(() => {})
      } else {
        // Trình duyệt không hỗ trợ HLS
        setMode('error')
      }
    }).catch(() => setMode('error'))
  }, [mode, m3u8Url])

  // --- Render: Embed mode ---
  if (mode === 'embed' && embedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
        />
        {/* Nút chuyển sang HLS nếu có m3u8 */}
        {m3u8Url && (
          <button
            onClick={() => setMode('hls')}
            className="absolute bottom-3 right-3 text-xs bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-md z-10 transition-colors"
          >
            🎬 Player thay thế
          </button>
        )}
      </div>
    )
  }

  // --- Render: HLS mode ---
  if (mode === 'hls' && m3u8Url) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          title={title}
        />
        {/* Nút quay lại embed */}
        {embedUrl && (
          <button
            onClick={() => {
              if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
              }
              setMode('embed')
            }}
            className="absolute top-3 right-3 text-xs bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-md z-10 transition-colors"
          >
            ↩ Dùng embed player
          </button>
        )}
      </div>
    )
  }

  // --- Render: Error / No source ---
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-white text-lg">⚠️ Không thể tải video</p>
      <p className="text-gray-400 text-sm">Hãy thử server khác hoặc làm mới trang</p>
      <div className="flex gap-3">
        {embedUrl && (
          <button
            onClick={() => setMode('embed')}
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Dùng Embed Player
          </button>
        )}
        {m3u8Url && (
          <button
            onClick={() => setMode('hls')}
            className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Thử lại HLS
          </button>
        )}
      </div>
    </div>
  )
}
