export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const currency = searchParams.get("currency")?.toLowerCase()

  if (!id || !currency) return Response.json({ error: "Missing params" }, { status: 400 })

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return Response.json({ error: "Failed to fetch" }, { status: 502 })

  const data = await res.json()
  const price = data[id]?.[currency]

  if (price === undefined) return Response.json({ error: "Currency not supported" }, { status: 404 })

  return Response.json({ price })
}
