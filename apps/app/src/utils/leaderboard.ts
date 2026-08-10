import type { DataType, Order, ReturnDataType } from '@/types/leaderboard'
import { GET_RANK_BY_USER_ID_API } from '@/constants/url'

export const fetchScores = async (
  gameType: string,
  scoreType: string,
  timeFilter: string,
  count: number,
  offset: number
): Promise<ReturnDataType> => {
  const response = await fetch(
    `/api/leaderboards?${new URLSearchParams({
      game: gameType,
      score: scoreType,
      time: timeFilter,
      count: String(count),
      offset: String(offset),
    })}`,
    { cache: 'no-store' }
  )
  if (!response.ok) throw new Error('Unable to load leaderboard')
  return response.json()
}

function descendingComparator(a: DataType, b: DataType, orderBy: keyof DataType['stats']) {
  const [numberOfA, numberOfB] =
    orderBy !== 'rank'
      ? [parseFloat(a.stats[orderBy]), parseFloat(b.stats[orderBy])]
      : [a.rank, b.rank]
  if (numberOfB < numberOfA) {
    return -1
  }
  if (numberOfB > numberOfA) {
    return 1
  }
  return 0
}

export const getComparator = <Key extends keyof unknown>(
  order: Order,
  orderBy: Key
): ((a: DataType, b: DataType) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export const fetchRankByUserId = async (
  userId: string,
  game: string,
  scoreType: string,
  timeFilter: string
): Promise<Response | unknown> => {
  try {
    const res = await fetch(
      `${GET_RANK_BY_USER_ID_API}?${new URLSearchParams({
        user_id: userId,
        game,
        time_window: timeFilter,
        score_type: scoreType,
      })}`
    )
    return res
  } catch (e) {
    return e
  }
}
