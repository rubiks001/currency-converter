export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
    next: { revalidate: 3600 }, // cache for 1 hour on the server
  })
  const data = await res.json()

  const rate = data.rates[to as string]

  return Response.json({ rate })
}
