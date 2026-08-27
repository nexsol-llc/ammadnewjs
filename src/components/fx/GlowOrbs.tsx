/** Ambient aurora blobs — pure CSS, sits behind section content. */
export function GlowOrbs({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'section' | 'cta'
  className?: string
}) {
  if (variant === 'cta') {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ''}`}>
        <div className="animate-aurora absolute -top-1/3 left-1/4 h-[36rem] w-[36rem] rounded-full bg-accent-500/25 blur-[130px]" />
        <div className="animate-aurora absolute -bottom-1/3 right-1/4 h-[32rem] w-[32rem] rounded-full bg-violet-500/25 blur-[130px] [animation-delay:-7s]" />
      </div>
    )
  }
  if (variant === 'section') {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ''}`}>
        <div className="animate-aurora absolute top-0 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-violet-500/12 blur-[120px]" />
        <div className="animate-aurora absolute bottom-[-20%] left-[-8%] h-[26rem] w-[26rem] rounded-full bg-accent-500/10 blur-[120px] [animation-delay:-6s]" />
      </div>
    )
  }
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ''}`}>
      <div className="animate-aurora absolute -top-[15%] left-[8%] h-[42rem] w-[42rem] rounded-full bg-accent-500/18 blur-[150px]" />
      <div className="animate-aurora absolute top-[10%] right-[-12%] h-[38rem] w-[38rem] rounded-full bg-violet-500/18 blur-[150px] [animation-delay:-5s]" />
      <div className="animate-aurora absolute bottom-[-25%] left-[30%] h-[34rem] w-[34rem] rounded-full bg-indigo-500/12 blur-[140px] [animation-delay:-9s]" />
    </div>
  )
}
