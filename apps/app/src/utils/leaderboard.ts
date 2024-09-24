import type { DataType, ReturnDataType, Order } from '@/types/leaderboard';
import { GET_RANK_BY_USER_ID_API, LEADERBOARD_SCORE_API_URL, LEADERBOARD_USERNAMES_API_URL } from '@/constants/url';
import { LEADERBOARDS } from '@/constants/leaderboards';

export const fetchUserNames = async (items: any): Promise<DataType[]> => {
  try {
    const res = await fetch(`${LEADERBOARD_USERNAMES_API_URL}?ids=${items}&include_stats=false`);
    return await res.json();
  } catch (e) {
    return [];
  }
};

export const fetchScores = async (
  gameType: string,
  scoreType: string,
  timeFilter: string,
  count: number,
  offset: number,
): Promise<ReturnDataType> => {
  // const res = await fetch(
  //   `${
  //     LEADERBOARD_SCORE_API_URL as string
  //   }?game=${gameType}&score_type=${scoreType}&time_window=${timeFilter}&count=${count}&offset=${offset}`,
  // );
  // const json = await res.json();
  // @ts-expect-error ignore implicit any
  const leaderboard = LEADERBOARDS[gameType][scoreType];
  const json = { data: leaderboard.slice(offset, offset + count), count: leaderboard.length };

  const addAvg = json.data.map((data: DataType) => {
    const { earnings, matches } = data?.stats || {};
    const avg = earnings && matches ? Math.round((parseFloat(earnings) * 100) / parseFloat(matches)) / 100 : 0;
    let rate = 0;
    let earningsParsed = Math.round(parseFloat(earnings ?? '0') * 10) / 10;
    let kills = Number(data.stats?.kills ?? '0');
    switch (scoreType) {
      case 'win_rate':
        rate = parseFloat(data.score) * 100;
        break;
      case 'earnings':
        earningsParsed = Number(data.score);
        break;
      case 'kills':
        kills = Number(data.score);
        break;
      default:
        break;
    }
    return {
      ...data,
      stats: {
        ...data.stats,
        score: Number(data.score ?? '0').toLocaleString(),
        'avg_NFTL/match': avg,
        win_rate: `${rate}%`,
        earnings: earningsParsed.toLocaleString(),
        kills: kills.toLocaleString(),
      },
    };
  });
  // get names
  const items: DataType[] = [];
  for (let i = 0; i < json.data.length; i++) {
    items.push(json.data[i].user_id);
  }
  const dd: DataType[] = await fetchUserNames(items);
  const a = Object.entries(dd);
  for (let i = 0; i < addAvg.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (addAvg[i].user_id === a?.[j]?.[0]) {
        addAvg[i].user_id = a?.[j]?.[1]?.name || '';
      }
    }
  }

  return { data: addAvg, count: json.count };
};

function descendingComparator(a: DataType, b: DataType, orderBy: keyof DataType['stats']) {
  const [numberOfA, numberOfB] =
    orderBy !== 'rank' ? [parseFloat(a.stats[orderBy]), parseFloat(b.stats[orderBy])] : [a.rank, b.rank];
  if (numberOfB < numberOfA) {
    return -1;
  }
  if (numberOfB > numberOfA) {
    return 1;
  }
  return 0;
}

export const getComparator = <Key extends keyof unknown>(
  order: Order,
  orderBy: Key,
): ((a: DataType, b: DataType) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

export const fetchRankByUserId = async (
  userId: string,
  game: string,
  scoreType: string,
  timeFilter: string,
): Promise<Response | unknown> => {
  try {
    const res = await fetch(
      `${GET_RANK_BY_USER_ID_API}?${new URLSearchParams({
        user_id: userId,
        game,
        time_window: timeFilter,
        score_type: scoreType,
      })}`,
    );
    return res;
  } catch (e) {
    return e;
  }
};
