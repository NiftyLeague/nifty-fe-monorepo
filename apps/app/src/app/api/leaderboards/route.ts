import { NextRequest, NextResponse } from 'next/server'

import { fetchScores } from '@/utils/leaderboard-server'

export const dynamic = 'force-dynamic'

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const game = searchParams.get('game')
  const score = searchParams.get('score')

  if (!game || !score) {
    return NextResponse.json({ error: 'game and score are required' }, { status: 400 })
  }

  try {
    const result = await fetchScores(
      game,
      score,
      searchParams.get('time') ?? 'all_time',
      Math.min(parsePositiveInteger(searchParams.get('count'), 50), 100),
      parsePositiveInteger(searchParams.get('offset'), 0)
    )
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Unknown leaderboard' }, { status: 400 })
  }
}
