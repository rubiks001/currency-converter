"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [logoVisible, setLogoVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true)
      return
    }
    const t1 = setTimeout(() => setLogoVisible(true), 80)
    const t2 = setTimeout(() => setExiting(true), 1700)
    const t3 = setTimeout(() => setDone(true), 2300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (done) return null

  return (
    <div
      role="status"
      aria-label="Loading Rubiks FX"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 transition-all duration-500 ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-500 ${
          logoVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-90"
        }`}
      >
        <span className="text-7xl drop-shadow-lg select-none" aria-hidden="true">💱</span>
        <span className="text-5xl font-black tracking-tight text-white drop-shadow-lg select-none">
          Rubiks FX
        </span>
        <span className="text-sm text-white/60 tracking-[0.3em] uppercase select-none">
          Live Currency Converter
        </span>
      </div>
    </div>
  )
}
