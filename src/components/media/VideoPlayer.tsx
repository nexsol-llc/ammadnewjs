'use client'

import { toEmbedSrc, isVerticalEmbed } from '@/lib/embed'
import type { VideoItem } from '@/lib/cms'
import { Play } from 'lucide-react'
import { useState } from 'react'

/** Renders an uploaded video file or a social embed (YouTube / IG / TikTok). */
export function VideoPlayer({ video, className }: { video: VideoItem; className?: string }) {
  const [activated, setActivated] = useState(false)

  const shell = 'overflow-hidden rounded-xl border border-line bg-surface-3'

  if (video.source === 'embed' && video.embedUrl) {
    const src = toEmbedSrc(video.embedUrl)
    const vertical = isVerticalEmbed(video.embedUrl)
    if (!src) {
      return (
        <a
          href={video.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${shell} flex aspect-video items-center justify-center gap-2 text-sm font-semibold text-brand-600 ${className || ''}`}
        >
          <Play className="h-5 w-5" /> Watch video
        </a>
      )
    }
    return (
      <div className={`${shell} ${vertical ? 'aspect-[9/16] max-w-[340px]' : 'aspect-video'} ${className || ''}`}>
        <iframe
          src={src}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={video.caption || 'Campaign video'}
        />
      </div>
    )
  }

  if (video.media?.url) {
    return (
      <div className={`${shell} ${className || ''}`}>
        {activated ? (
          <video src={video.media.url} controls autoPlay playsInline className="h-full w-full object-contain" />
        ) : (
          <button
            onClick={() => setActivated(true)}
            className="group relative flex h-full w-full items-center justify-center"
            aria-label={`Play ${video.caption || 'video'}`}
          >
            <video
              src={`${video.media.url}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink-950/20 transition-colors group-hover:bg-ink-950/30">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(16,16,40,0.5)] transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-6 w-6 text-brand-600" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
    )
  }

  return null
}
