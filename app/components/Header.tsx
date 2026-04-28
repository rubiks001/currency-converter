"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/currency", label: "Currency" },
  { href: "/crypto", label: "Crypto" },
]

export default function Header() {
  const [dark, setDark] = useState(false)
  const pathname = usePathname()

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
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-2xl" aria-hidden="true">💱</span>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Rubiks FX
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === link.href
                  ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
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
      </div>

      {/* Mobile nav — tab bar below header */}
      <nav className="sm:hidden flex border-t border-gray-100 dark:border-gray-800" aria-label="Main navigation">
        {NAV.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center py-2.5 text-sm font-medium transition-all duration-300 ${
              pathname === link.href
                ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-500"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
