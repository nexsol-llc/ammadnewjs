/** Convert a social video URL into an embeddable iframe src. Returns null if unknown. */
export function toEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname.startsWith('/watch')) {
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      const shorts = u.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`
    }

    // Instagram post / reel
    if (host === 'instagram.com') {
      const m = u.pathname.match(/^\/(p|reel|reels)\/([\w-]+)/)
      if (m) return `https://www.instagram.com/${m[1] === 'p' ? 'p' : 'reel'}/${m[2]}/embed`
    }

    // TikTok
    if (host === 'tiktok.com') {
      const m = u.pathname.match(/\/video\/(\d+)/)
      if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`
    }

    // Vimeo
    if (host === 'vimeo.com') {
      const m = u.pathname.match(/^\/(\d+)/)
      if (m) return `https://player.vimeo.com/video/${m[1]}`
    }

    return null
  } catch {
    return null
  }
}

/** Vertical (9:16) embeds: Instagram reels & TikTok. */
export function isVerticalEmbed(url: string): boolean {
  return /instagram\.com|tiktok\.com|\/shorts\//.test(url)
}
