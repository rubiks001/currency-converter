"use client"

import { useEffect, useState } from "react"

export default function Header() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("fx-dark") === "true"
    setDark(saved)
    document.documentElement.classList.toggle("dark", saved)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    localStorage.setItem("fx-dark", String(next))
    document.documentElement.classList.add("theme-transitioning")
    document.documentElement.classList.toggle("dark", next)
    setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 450)
  }

  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">💱</span>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
          Rubiks FX
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-gray-400 tracking-wide">Live Rates</span>
        </div>
        <button
          onClick={toggle}
          className="text-xl leading-none"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span aria-hidden="true">{dark ? "☀️" : "🌙"}</span>
        </button>
      </div>
    </header>
  )
}
