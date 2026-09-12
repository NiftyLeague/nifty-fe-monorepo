import { fetchScores } from '@/utils/leaderboard-server'

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/**
 * Archived leaderboard scores for one game and score type.
 *
 * Kept as a plain function so it can be unit tested without a running server.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const game = searchParams.get('game')
  const score = searchParams.get('score')

  if (!game || !score) {
    return Response.json({ error: 'game and score are required' }, { status: 400 })
  }

  try {
    const result = await fetchScores(
      game,
      score,
      searchParams.get('time') ?? 'all_time',
      Math.min(parsePositiveInteger(searchParams.get('count'), 50), 100),
      parsePositiveInteger(searchParams.get('offset'), 0)
    )
    return Response.json(result)
  } catch {
    return Response.json({ error: 'Unknown leaderboard' }, { status: 400 })
  }
}
