'use client'
export default function StopPropDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  )
}
