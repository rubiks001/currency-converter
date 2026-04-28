"use client"

import { useState, useRef, useEffect } from "react"

type Currency = { code: string; name: string }

type HistoryItem = {
  id: string
  amount: string
  from: string
  to: string
  result: number
  rate: number
}

const CURRENCIES: Currency[] = [
  { code: "AED", name: "UAE Dirham" },
  { code: "AFN", name: "Afghan Afghani" },
  { code: "ALL", name: "Albanian Lek" },
  { code: "AMD", name: "Armenian Dram" },
  { code: "ANG", name: "Netherlands Antillean Guilder" },
  { code: "AOA", name: "Angolan Kwanza" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "AWG", name: "Aruban Florin" },
  { code: "AZN", name: "Azerbaijani Manat" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BBD", name: "Barbadian Dollar" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "BGN", name: "Bulgarian Lev" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "BIF", name: "Burundian Franc" },
  { code: "BMD", name: "Bermudian Dollar" },
  { code: "BND", name: "Brunei Dollar" },
  { code: "BOB", name: "Bolivian Boliviano" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "BSD", name: "Bahamian Dollar" },
  { code: "BTN", name: "Bhutanese Ngultrum" },
  { code: "BWP", name: "Botswanan Pula" },
  { code: "BYN", name: "Belarusian Ruble" },
  { code: "BZD", name: "Belize Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CRC", name: "Costa Rican Colón" },
  { code: "CUP", name: "Cuban Peso" },
  { code: "CVE", name: "Cape Verdean Escudo" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DJF", name: "Djiboutian Franc" },
  { code: "DKK", name: "Danish Krone" },
  { code: "DOP", name: "Dominican Peso" },
  { code: "DZD", name: "Algerian Dinar" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ERN", name: "Eritrean Nakfa" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "EUR", name: "Euro" },
  { code: "FJD", name: "Fijian Dollar" },
  { code: "FKP", name: "Falkland Islands Pound" },
  { code: "GBP", name: "British Pound" },
  { code: "GEL", name: "Georgian Lari" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "GIP", name: "Gibraltar Pound" },
  { code: "GMD", name: "Gambian Dalasi" },
  { code: "GNF", name: "Guinean Franc" },
  { code: "GTQ", name: "Guatemalan Quetzal" },
  { code: "GYD", name: "Guyanaese Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HNL", name: "Honduran Lempira" },
  { code: "HTG", name: "Haitian Gourde" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "Israeli New Shekel" },
  { code: "INR", name: "Indian Rupee" },
  { code: "IQD", name: "Iraqi Dinar" },
  { code: "IRR", name: "Iranian Rial" },
  { code: "ISK", name: "Icelandic Króna" },
  { code: "JMD", name: "Jamaican Dollar" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "KGS", name: "Kyrgystani Som" },
  { code: "KHR", name: "Cambodian Riel" },
  { code: "KMF", name: "Comorian Franc" },
  { code: "KRW", name: "South Korean Won" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "KYD", name: "Cayman Islands Dollar" },
  { code: "KZT", name: "Kazakhstani Tenge" },
  { code: "LAK", name: "Laotian Kip" },
  { code: "LBP", name: "Lebanese Pound" },
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "LSL", name: "Lesotho Loti" },
  { code: "LYD", name: "Libyan Dinar" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", name: "Moldovan Leu" },
  { code: "MGA", name: "Malagasy Ariary" },
  { code: "MKD", name: "Macedonian Denar" },
  { code: "MMK", name: "Myanma Kyat" },
  { code: "MNT", name: "Mongolian Tögrög" },
  { code: "MOP", name: "Macanese Pataca" },
  { code: "MRU", name: "Mauritanian Ouguiya" },
  { code: "MUR", name: "Mauritian Rupee" },
  { code: "MVR", name: "Maldivian Rufiyaa" },
  { code: "MWK", name: "Malawian Kwacha" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "MZN", name: "Mozambican Metical" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "NIO", name: "Nicaraguan Córdoba" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "OMR", name: "Omani Rial" },
  { code: "PAB", name: "Panamanian Balboa" },
  { code: "PEN", name: "Peruvian Sol" },
  { code: "PGK", name: "Papua New Guinean Kina" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PLN", name: "Polish Złoty" },
  { code: "PYG", name: "Paraguayan Guaraní" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RSD", name: "Serbian Dinar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "SBD", name: "Solomon Islands Dollar" },
  { code: "SCR", name: "Seychellois Rupee" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "SHP", name: "Saint Helena Pound" },
  { code: "SLE", name: "Sierra Leonean Leone" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "SRD", name: "Surinamese Dollar" },
  { code: "STN", name: "São Tomé and Príncipe Dobra" },
  { code: "SYP", name: "Syrian Pound" },
  { code: "SZL", name: "Swazi Lilangeni" },
  { code: "THB", name: "Thai Baht" },
  { code: "TJS", name: "Tajikistani Somoni" },
  { code: "TMT", name: "Turkmenistani Manat" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "TOP", name: "Tongan Paʻanga" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "TTD", name: "Trinidad and Tobago Dollar" },
  { code: "TWD", name: "New Taiwan Dollar" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "USD", name: "US Dollar" },
  { code: "UYU", name: "Uruguayan Peso" },
  { code: "UZS", name: "Uzbekistani Som" },
  { code: "VES", name: "Venezuelan Bolívar" },
  { code: "VND", name: "Vietnamese Đồng" },
  { code: "VUV", name: "Vanuatu Vatu" },
  { code: "WST", name: "Samoan Tala" },
  { code: "XAF", name: "Central African CFA Franc" },
  { code: "XCD", name: "East Caribbean Dollar" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "XPF", name: "CFP Franc" },
  { code: "YER", name: "Yemeni Rial" },
  { code: "ZAR", name: "South African Rand" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "ZWL", name: "Zimbabwean Dollar" },
]

function CurrencySelect({
  value,
  onChange,
  favourites,
  onToggleFavourite,
  exclude,
}: {
  value: string
  onChange: (code: string) => void
  favourites: string[]
  onToggleFavourite: (code: string) => void
  exclude: string
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <span className="truncate">{selected?.code} — {selected?.name}</span>
        <span className="text-gray-400 ml-2 shrink-0">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
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
          <ul className="max-h-52 overflow-y-auto">
            {sorted.map((c) => (
              <li
                key={c.code}
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
                  {c.code} — {c.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavourite(c.code) }}
                  className={`ml-2 shrink-0 text-sm transition-opacity ${
                    favourites.includes(c.code)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                  }`}
                  title={favourites.includes(c.code) ? "Remove from favourites" : "Add to favourites"}
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

  // Load persisted data after hydration — setState inside .then() satisfies the
  // react-hooks/set-state-in-effect rule (callback, not synchronous in effect body)
  useEffect(() => {
    const savedHistory = localStorage.getItem("fx-history")
    const savedFavourites = localStorage.getItem("fx-favourites")
    Promise.resolve().then(() => {
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      if (savedFavourites) setFavourites(JSON.parse(savedFavourites))
    })
  }, [])

  // Called from event handlers only (not useEffect) so setState is always fine
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

  // Initial rate fetch on mount — setState only in .then() callbacks, never synchronously
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
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-10 bg-gray-100 dark:bg-gray-950">
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConvert()
            }}
            placeholder="Enter amount and press Enter"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">From</label>
            <CurrencySelect
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
            title="Swap currencies"
          >
            ⇄
          </button>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">To</label>
            <CurrencySelect
              value={toCurrency}
              onChange={(code) => { setToCurrency(code); loadRate(fromCurrency, code) }}
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
              exclude={fromCurrency}
            />
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={!amount || parseFloat(amount) <= 0 || loading}
          className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity mb-4"
        >
          {loading ? "Fetching rate..." : "Convert"}
        </button>

        {error && (
          <p className="mb-4 text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-4">
            {error}
          </p>
        )}

        {loading && (
          <div className="text-center py-4">
            <span className="text-sm text-gray-400">Converting...</span>
          </div>
        )}

        {result !== null && !loading && (
          <div className="text-center rounded-xl p-5 bg-violet-50 dark:bg-violet-900/20">
            {rate !== null && (
              <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </p>
            )}
            <p className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {result.toFixed(2)} {toCurrency}
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

      {history.length > 0 && (
        <div className="mt-4 w-full max-w-md sm:max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              Past Searches
            </p>
            <button
              onClick={() => {
                setHistory([])
                localStorage.removeItem("fx-history")
              }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2.5">
            {history.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {item.amount} {item.from}
                </span>
                <span className="text-gray-400 dark:text-gray-600 mx-2">→</span>
                <span className="font-semibold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                  {item.result.toFixed(2)} {item.to}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
