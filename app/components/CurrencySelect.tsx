"use client"

import { useState, useRef, useEffect } from "react"
import { CURRENCIES, getCurrencyFlag } from "../lib/currencies"

export default function CurrencySelect({
  value,
  onChange,
  favourites,
  onToggleFavourite,
  exclude,
  id,
}: {
  value: string
  onChange: (code: string) => void
  favourites: string[]
  onToggleFavourite: (code: string) => void
  exclude?: string
  id: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code !== exclude &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  )

  const sorted = [
    ...filtered.filter((c) => favourites.includes(c.code)),
    ...filtered.filter((c) => !favourites.includes(c.code)),
  ]

  const selected = CURRENCIES.find((c) => c.code === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-label={`${selected?.code} — ${selected?.name}`}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <span className="truncate">{selected && getCurrencyFlag(selected.code)} {selected?.code} — {selected?.name}</span>
        <span className="text-gray-400 ml-2 shrink-0">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg animate-dropdown-in">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <ul role="listbox" id={`${id}-listbox`} className="max-h-52 overflow-y-auto">
            {sorted.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === value}
                className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${
                  c.code === value
                    ? "bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium"
                    : "text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span
                  className="flex-1 truncate"
                  onClick={() => { onChange(c.code); setIsOpen(false); setSearch("") }}
                >
                  {favourites.includes(c.code) && (
                    <span className="mr-1.5 text-yellow-400">★</span>
                  )}
                  {getCurrencyFlag(c.code)} {c.code} — {c.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavourite(c.code) }}
                  className={`ml-2 shrink-0 text-sm transition-opacity ${
                    favourites.includes(c.code)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                  }`}
                  aria-label={favourites.includes(c.code) ? `Remove ${c.code} from favourites` : `Add ${c.code} to favourites`}
                >
                  ★
                </button>
              </li>
            ))}
            {sorted.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
