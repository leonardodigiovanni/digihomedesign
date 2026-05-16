'use client'
import { useEffect, useRef } from 'react'

const PERIOD = 1400 // ms — deve corrispondere alla durata in globals.css

export default function PulsaSync({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const elapsed = performance.now() % PERIOD
    ref.current.style.animationDelay = `${-elapsed}ms`
  }, [])

  return <span ref={ref}>{children}</span>
}
