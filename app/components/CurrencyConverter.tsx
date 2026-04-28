"use client"

import { useState, useEffect } from "react"
import { fmt } from "../lib/currencies"
import CurrencySelect from "./CurrencySelect"

type HistoryItem = {
  id: string
  amount: string
  from: string
  to: string
  result: number
  rate: number
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favourites, setFavourites] = useState<string[]>([])
  const [swapKey, setSwapKey] = useState(0)
  const [resultKey, setResultKey] = useState(0)

  useEffect(() => {
    const savedHistory = localStorage.getItem("fx-history")
    const savedFavourites = localStorage.getItem("fx-favourites")
    Promise.resolve().then(() => {
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      if (savedFavourites) setFavourites(JSON.parse(savedFavourites))
    })
  }, [])

  async function loadRate(from: string, to: string) {
    if (from === to) { setRate(1); setLoading(false); return }
    setRate(null)
    setResult(null)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/rates?from=${from}&to=${to}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRate(data.rate)
    } catch {
      setError("Could not fetch rates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetch(`/api/rates?from=${fromCurrency}&to=${toCurrency}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setRate(data.rate) })
      .catch(() => { if (!cancelled) setError("Could not fetch rates.") })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleConvert() {
    if (!amount || parseFloat(amount) <= 0 || rate === null) return
    const calculated = parseFloat(amount) * rate
    setResultKey(k => k + 1)
    setResult(calculated)
    const item: HistoryItem = {
      id: Date.now().toString(),
      amount,
      from: fromCurrency,
      to: toCurrency,
      result: calculated,
      rate,
    }
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 5)
      localStorage.setItem("fx-history", JSON.stringify(next))
      return next
    })
  }

  function handleSwap() {
    setSwapKey(k => k + 1)
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    loadRate(toCurrency, fromCurrency)
  }

  function handleCopy() {
    if (result === null) return
    navigator.clipboard.writeText(result.toFixed(2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleFavourite(code: string) {
    setFavourites((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
      localStorage.setItem("fx-favourites", JSON.stringify(next))
      return next
    })
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-10 bg-gray-100 dark:bg-gray-950 animate-page-in">
      <div className="rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Currency Converter
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Amount</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const val = e.target.value
              if (/^\d*\.?\d*$/.test(val)) setAmount(val)
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleConvert() }}
            placeholder="Enter amount and press Enter"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">From</label>
            <CurrencySelect
              id="from-currency"
              value={fromCurrency}
              onChange={(code) => { setFromCurrency(code); loadRate(code, toCurrency) }}
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
              exclude={toCurrency}
            />
          </div>
          <button
            onClick={handleSwap}
            className="self-center p-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-400 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors rotate-90 sm:rotate-0"
            aria-label="Swap currencies"
          >
            <span key={swapKey} aria-hidden="true" className="inline-block animate-spin-once">⇄</span>
          </button>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">To</label>
            <CurrencySelect
              id="to-currency"
              value={toCurrency}
              onChange={(code) => { setToCurrency(code); loadRate(fromCurrency, code) }}
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
              exclude={fromCurrency}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm mb-4 h-5">
          {loading && <span className="text-gray-400 text-xs animate-pulse">Fetching rate…</span>}
          {!loading && rate !== null && (
            <span key={`${fromCurrency}-${toCurrency}-${rate}`} className="flex items-center gap-2 animate-fade-slide-in">
              <span className="text-gray-400 dark:text-gray-500 text-xs">1 {fromCurrency} =</span>
              <span className="inline-block font-semibold text-violet-600 dark:text-violet-400 text-sm animate-rate-pop">
                {rate.toFixed(4)} {toCurrency}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleConvert}
          disabled={!amount || parseFloat(amount) <= 0 || loading}
          className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-4"
        >
          Convert
        </button>

        {error && (
          <p key={error} className="mb-4 text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-4 animate-error-in">
            {error}
          </p>
        )}

        {loading && (
          <div className="text-center py-4">
            <span className="text-sm text-gray-400">Converting...</span>
          </div>
        )}

        <div aria-live="polite" aria-atomic="true">
          {result !== null && !loading && (
            <div key={resultKey} className="text-center rounded-xl p-5 bg-violet-50 dark:bg-violet-900/20 animate-result-in">
              {rate !== null && (
                <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </p>
              )}
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                {fmt(result)} {toCurrency}
              </p>
              <button
                onClick={handleCopy}
                className={`mt-3 text-xs px-4 py-1.5 rounded-full border transition-colors ${
                  copied
                    ? "border-green-400 text-green-500"
                    : "border-gray-300 dark:border-gray-600 text-gray-400 hover:border-violet-400 hover:text-violet-500"
                }`}
              >
                {copied ? "✓ Copied" : "Copy result"}
              </button>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-4 w-full max-w-md sm:max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Past Searches</p>
            <button
              onClick={() => { setHistory([]); localStorage.removeItem("fx-history") }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2.5">
            {history.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm animate-slide-in-left">
                <span className="text-gray-500 dark:text-gray-400">{item.amount} {item.from}</span>
                <span className="text-gray-400 dark:text-gray-600 mx-2">→</span>
                <span className="font-semibold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                  {fmt(item.result)} {item.to}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
