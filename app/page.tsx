import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 bg-gray-100 dark:bg-gray-950 animate-page-in">
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-6xl sm:text-8xl mb-6 block select-none" aria-hidden="true">💱</span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Rubiks FX
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-sm mx-auto">
          Real-time currency and crypto conversion at your fingertips.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/currency"
          className="group rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all animate-card-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="text-4xl mb-4 select-none" aria-hidden="true">🌍</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Currency</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Convert between 170+ world currencies with live rates.
          </p>
          <span className="inline-block text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
            Open →
          </span>
        </Link>

        <Link
          href="/crypto"
          className="group rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all animate-card-in"
          style={{ animationDelay: "220ms" }}
        >
          <div className="text-4xl mb-4 select-none" aria-hidden="true">₿</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Crypto</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Convert top cryptocurrencies to any world currency.
          </p>
          <span className="inline-block text-sm font-semibold text-pink-500 dark:text-pink-400 group-hover:translate-x-1 transition-transform">
            Open →
          </span>
        </Link>
      </div>
    </main>
  )
}
