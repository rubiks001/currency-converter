"use client"

import { useState, useRef, useEffect } from "react"
import { CURRENCIES, getCurrencyFlag, fmt } from "../lib/currencies"
import { CRYPTOS, type Crypto } from "../lib/cryptos"
import CurrencySelect from "./CurrencySelect"

type Mode = "crypto-to-fiat" | "fiat-to-crypto" | "crypto-to-crypto"

type HistoryItem = {
  id: string
  amount: string
  fromLabel: string
  toLabel: string
  result: number
  mode: Mode
}

function CryptoSelect({
  value,
  onChange,
  exclude,
  id,
}: {
  value: string
  onChange: (id: string) => void
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

  const filtered = CRYPTOS.filter(
    (c) =>
      c.id !== exclude &&
      (c.symbol.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  )

  const selected = CRYPTOS.find((c) => c.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-label={`${selected?.symbol} — ${selected?.name}`}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <span className="truncate font-medium">
          <span className="text-pink-500 dark:text-pink-400 mr-1">{selected?.symbol}</span>
          — {selected?.name}
        </span>
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
              placeholder="Search crypto..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <ul role="listbox" id={`${id}-listbox`} className="max-h-52 overflow-y-auto">
            {filtered.map((c: Crypto) => (
              <li
                key={c.id}
                role="option"
                aria-selected={c.id === value}
                onClick={() => { onChange(c.id); setIsOpen(false); setSearch("") }}
                className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer ${
                  c.id === value
                    ? "bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium"
                    : "text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="font-bold text-pink-500 dark:text-pink-400 w-12 shrink-0">{c.symbol}</span>
                <span className="truncate text-gray-600 dark:text-gray-300">{c.name}</span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const MODES: { value: Mode; label: string }[] = [
  { value: "crypto-to-fiat", label: "Crypto → Fiat" },
  { value: "crypto-to-crypto", label: "Crypto → Crypto" },
  { value: "fiat-to-crypto", label: "Fiat → Crypto" },
]

export default function CryptoConverter() {
  const [mode, setMode] = useState<Mode>("crypto-to-fiat")
  const [amount, setAmount] = useState("")
  const [fromCryptoId, setFromCryptoId] = useState("bitcoin")
  const [toCryptoId, setToCryptoId] = useState("ethereum")
  const [fiatCode, setFiatCode] = useState("USD")
  const [price, setPrice] = useState<number | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favourites, setFavourites] = useState<string[]>([])
  const [swapKey, setSwapKey] = useState(0)
  const [resultKey, setResultKey] = useState(0)

  useEffect(() => {
    const savedHistory = localStorage.getItem("crypto-history")
    const savedFavourites = localStorage.getItem("fx-favourites")
    Promise.resolve().then(() => {
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      if (savedFavourites) setFavourites(JSON.parse(savedFavourites))
    })
  }, [])

  async function loadPrice(currentMode: Mode, fromId: string, toId: string, fiat: string) {
    setPrice(null)
    setResult(null)
    setLoading(true)
    setError(null)
    try {
      if (currentMode === "crypto-to-crypto") {
        // Fetch both prices in USD then compute cross rate
        const [resA, resB] = await Promise.all([
          fetch(`/api/crypto?id=${fromId}&currency=usd`),
          fetch(`/api/crypto?id=${toId}&currency=usd`),
        ])
        if (!resA.ok || !resB.ok) throw new Error("Failed to fetch prices")
        const [dataA, dataB] = await Promise.all([resA.json(), resB.json()])
        if (!dataA.price || !dataB.price) throw new Error("Currency not supported")
        setPrice(dataA.price / dataB.price)
      } else {
        const currency = currentMode === "crypto-to-fiat" ? fiat : fiat
        const id = currentMode === "crypto-to-fiat" ? fromId : toId
        const res = await fetch(`/api/crypto?id=${id}&currency=${currency.toLowerCase()}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? "Failed")
        }
        const data = await res.json()
        setPrice(data.price)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch price. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrice(mode, fromCryptoId, toCryptoId, fiatCode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    setResult(null)
    setAmount("")
    loadPrice(newMode, fromCryptoId, toCryptoId, fiatCode)
  }

  function handleConvert() {
    if (!amount || parseFloat(amount) <= 0 || price === null) return
    const val = parseFloat(amount)
    const fromCrypto = CRYPTOS.find((c) => c.id === fromCryptoId)
    const toCrypto = CRYPTOS.find((c) => c.id === toCryptoId)

    let calculated: number
    let fromLabel: string
    let toLabel: string

    if (mode === "crypto-to-fiat") {
      calculated = val * price
      fromLabel = fromCrypto?.symbol ?? fromCryptoId
      toLabel = fiatCode
    } else if (mode === "fiat-to-crypto") {
      calculated = val / price
      fromLabel = fiatCode
      toLabel = fromCrypto?.symbol ?? fromCryptoId
    } else {
      calculated = val * price
      fromLabel = fromCrypto?.symbol ?? fromCryptoId
      toLabel = toCrypto?.symbol ?? toCryptoId
    }

    setResultKey(k => k + 1)
    setResult(calculated)
    const item: HistoryItem = {
      id: Date.now().toString(),
      amount,
      fromLabel,
      toLabel,
      result: calculated,
      mode,
    }
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 5)
      localStorage.setItem("crypto-history", JSON.stringify(next))
      return next
    })
  }

  function handleSwap() {
    setSwapKey(k => k + 1)
    setResult(null)
    if (mode === "crypto-to-fiat") {
      handleModeChange("fiat-to-crypto")
    } else if (mode === "fiat-to-crypto") {
      handleModeChange("crypto-to-fiat")
    } else {
      setFromCryptoId(toCryptoId)
      setToCryptoId(fromCryptoId)
      loadPrice("crypto-to-crypto", toCryptoId, fromCryptoId, fiatCode)
    }
  }

  function handleCopy() {
    if (result === null) return
    navigator.clipboard.writeText(result.toFixed(8))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleFavourite(code: string) {
    setFavourites((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      localStorage.setItem("fx-favourites", JSON.stringify(next))
      return next
    })
  }

  const fromCrypto = CRYPTOS.find((c) => c.id === fromCryptoId)
  const toCrypto = CRYPTOS.find((c) => c.id === toCryptoId)
  const fiat = CURRENCIES.find((c) => c.code === fiatCode)

  const rateLabel = mode === "crypto-to-crypto"
    ? `1 ${fromCrypto?.symbol} = ${price?.toFixed(6)} ${toCrypto?.symbol}`
    : `1 ${fromCrypto?.symbol} = ${getCurrencyFlag(fiatCode)} ${price ? fmt(price) : "…"} ${fiatCode}`

  const resultDecimals = mode === "fiat-to-crypto" || mode === "crypto-to-crypto" ? 8 : 2
  const toLabel = mode === "crypto-to-fiat" ? fiatCode
    : mode === "fiat-to-crypto" ? (fromCrypto?.symbol ?? "")
    : (toCrypto?.symbol ?? "")

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-10 bg-gray-100 dark:bg-gray-950 animate-page-in">
      <div className="rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-5 text-center text-gray-800 dark:text-gray-100">
          Crypto Converter
        </h1>

        {/* Mode tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 text-xs sm:text-sm">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`flex-1 py-2 font-medium transition-all duration-200 ${
                mode === m.value
                  ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

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
            placeholder={`Enter amount`}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
          {/* From selector */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              {mode === "fiat-to-crypto" ? "From Currency" : "From Crypto"}
            </label>
            {mode === "fiat-to-crypto" ? (
              <CurrencySelect
                id="fiat-from"
                value={fiatCode}
                onChange={(code) => { setFiatCode(code); loadPrice(mode, fromCryptoId, toCryptoId, code) }}
                favourites={favourites}
                onToggleFavourite={toggleFavourite}
              />
            ) : (
              <CryptoSelect
                id="crypto-from"
                value={fromCryptoId}
                exclude={mode === "crypto-to-crypto" ? toCryptoId : undefined}
                onChange={(id) => { setFromCryptoId(id); loadPrice(mode, id, toCryptoId, fiatCode) }}
              />
            )}
          </div>

          <button
            onClick={handleSwap}
            className="self-center p-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:border-pink-400 text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors rotate-90 sm:rotate-0"
            aria-label="Swap"
          >
            <span key={swapKey} aria-hidden="true" className="inline-block animate-spin-once">⇄</span>
          </button>

          {/* To selector */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              {mode === "crypto-to-fiat" ? "To Currency" : mode === "fiat-to-crypto" ? "To Crypto" : "To Crypto"}
            </label>
            {mode === "crypto-to-fiat" ? (
              <CurrencySelect
                id="fiat-to"
                value={fiatCode}
                onChange={(code) => { setFiatCode(code); loadPrice(mode, fromCryptoId, toCryptoId, code) }}
                favourites={favourites}
                onToggleFavourite={toggleFavourite}
              />
            ) : mode === "fiat-to-crypto" ? (
              <CryptoSelect
                id="crypto-to-fiat"
                value={fromCryptoId}
                onChange={(id) => { setFromCryptoId(id); loadPrice(mode, id, toCryptoId, fiatCode) }}
              />
            ) : (
              <CryptoSelect
                id="crypto-to-crypto"
                value={toCryptoId}
                exclude={fromCryptoId}
                onChange={(id) => { setToCryptoId(id); loadPrice(mode, fromCryptoId, id, fiatCode) }}
              />
            )}
          </div>
        </div>

        {/* Live rate display */}
        <div className="flex items-center justify-center gap-2 text-sm mb-4 h-5">
          {loading && <span className="text-gray-400 text-xs animate-pulse">Fetching price…</span>}
          {!loading && price !== null && (
            <span key={`${fromCryptoId}-${toCryptoId}-${fiatCode}-${price}`} className="flex items-center gap-2 animate-fade-slide-in">
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                {mode === "crypto-to-crypto"
                  ? `1 ${fromCrypto?.symbol} =`
                  : `1 ${fromCrypto?.symbol} =`}
              </span>
              <span className="inline-block font-semibold text-pink-600 dark:text-pink-400 text-sm animate-rate-pop">
                {mode === "crypto-to-crypto"
                  ? `${price.toFixed(6)} ${toCrypto?.symbol}`
                  : `${getCurrencyFlag(fiatCode)} ${fmt(price)} ${fiatCode}`}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleConvert}
          disabled={!amount || parseFloat(amount) <= 0 || loading || price === null}
          className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-4"
        >
          Convert
        </button>

        {error && (
          <p key={error} className="mb-4 text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-4 animate-error-in">
            {error === "Currency not supported"
              ? `${fiat?.name ?? fiatCode} is not supported. Try USD, EUR, GBP, or NGN.`
              : error}
          </p>
        )}

        <div aria-live="polite" aria-atomic="true">
          {result !== null && !loading && (
            <div key={resultKey} className="text-center rounded-xl p-5 bg-pink-50 dark:bg-pink-900/20 animate-result-in">
              {price !== null && (
                <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">{rateLabel}</p>
              )}
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                {result.toFixed(resultDecimals)} {toLabel}
              </p>
              <button
                onClick={handleCopy}
                className={`mt-3 text-xs px-4 py-1.5 rounded-full border transition-colors ${
                  copied
                    ? "border-green-400 text-green-500"
                    : "border-gray-300 dark:border-gray-600 text-gray-400 hover:border-pink-400 hover:text-pink-500"
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
              onClick={() => { setHistory([]); localStorage.removeItem("crypto-history") }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2.5">
            {history.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm animate-slide-in-left">
                <span className="text-gray-500 dark:text-gray-400">{item.amount} {item.fromLabel}</span>
                <span className="text-gray-400 dark:text-gray-600 mx-2">→</span>
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  {item.result.toFixed(item.mode === "crypto-to-fiat" ? 2 : 8)} {item.toLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
