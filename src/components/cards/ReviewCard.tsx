'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import type { ReviewItem } from '@/lib/cms'
import { VideoPlayer } from '@/components/media/VideoPlayer'

export function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="card card-hover flex h-full flex-col overflow-hidden p-5">
      {review.type === 'video' ? (
        <VideoPlayer
          video={{
            source: review.embedUrl ? 'embed' : 'upload',
            media: review.video,
            embedUrl: review.embedUrl,
            caption: `${review.reviewerName} — video review`,
          }}
          className="aspect-video w-full"
        />
      ) : review.image?.url ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface-2">
          <Image
            src={review.image.cardUrl || review.image.url}
            alt={review.image.alt || `Review from ${review.reviewerName}`}
            width={review.image.width || 800}
            height={review.image.height || 600}
            className="h-auto w-full object-contain"
          />
        </div>
      ) : null}

      {review.quote && (
        <div className="mt-5 flex-1">
          <Quote className="h-5 w-5 text-brand-200" fill="currentColor" />
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{review.quote}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="text-sm font-semibold text-ink-950">{review.reviewerName}</p>
          {review.role && <p className="text-xs text-ink-400">{review.role}</p>}
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  )
}
