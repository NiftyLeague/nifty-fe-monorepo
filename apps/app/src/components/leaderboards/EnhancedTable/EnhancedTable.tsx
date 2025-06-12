'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Box, CircularProgress, Typography } from '@mui/material';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { getLeaderboardRankAnalyticsEventName } from '@/constants/leaderboards';
import useAuth from '@/hooks/useAuth';
import usePlayerProfile from '@/hooks/usePlayerProfile';
import { ResponsiveTable } from '@nl/ui/mui';
import { toast } from 'react-toastify';
import type { ReturnDataType, TableProps, TableRowType } from '@/types/leaderboard';
import { sendEvent } from '@/utils/google-analytics';
import { fetchRankByUserId, fetchScores } from '@/utils/leaderboard';
import { errorMsgHandler } from '@/utils/errorHandlers';

const TopModal = dynamic(() => import('../TopModal'), { ssr: false });

const flatObject = (obj: { [key: string]: unknown }): Record<string, unknown> => {
  const keys = Object.keys(obj);
  return keys.reduce(
    (acc, k) => {
      const value = obj[k];
      return typeof value === 'object'
        ? { ...acc, ...flatObject(value as { [key: string]: unknown }) }
        : { ...acc, [k]: value };
    },
    {} as Record<string, unknown>,
  );
};

export default function EnhancedTable({
  selectedGame,
  selectedTable,
  selectedTimeFilter,
}: TableProps): React.ReactNode | null {
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 });
  const [rows, setData] = useState<Record<string, unknown>[] | null>();
  const [myRank, setMyRank] = useState<number>();
  const { isLoggedIn } = useAuth();
  const { profile } = usePlayerProfile();

  const fetchTopData = async () => {
    setPaginationModel(model => ({ pageSize: model.pageSize, page: 0 }));
    const returnValue: ReturnDataType = await fetchScores(
      selectedGame,
      selectedTable.key,
      selectedTimeFilter,
      paginationModel.pageSize,
      0,
    );
    const leaderBoardValue: Record<string, unknown>[] = [];
    returnValue.data.forEach(value => {
      leaderBoardValue.push(flatObject(value));
    });

    setData(leaderBoardValue);
    setCount(returnValue.count);
  };

  useEffect(() => {
    setData(null);
    fetchTopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, selectedTable.key, selectedTimeFilter]);

  const handleChangePage = async (newPage: number) => {
    if (rows && (newPage + 1) * paginationModel.pageSize > rows?.length && rows?.length < count) {
      const returnValue: ReturnDataType = await fetchScores(
        selectedGame,
        selectedTable.key,
        selectedTimeFilter,
        paginationModel.pageSize,
        newPage * paginationModel.pageSize,
      );
      const leaderBoardValue: Record<string, unknown>[] = [];
      returnValue.data.forEach(value => {
        leaderBoardValue.push(flatObject(value));
      });
      setData([...rows, ...leaderBoardValue]);
      setCount(returnValue.count);
    }
  };

  useEffect(() => {
    if (paginationModel.page !== 0) {
      handleChangePage(paginationModel.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page]);

  const handleCheckYourRank = async () => {
    const eventName = getLeaderboardRankAnalyticsEventName(selectedGame);
    if (eventName) {
      sendEvent(eventName, GOOGLE_ANALYTICS.CATEGORIES.LEADERBOARD, selectedTable.display);
    }
    const errorMes = 'You have not played the game yet! Play the game to see your rank on the leaderboard.';

    if (!profile?.id) {
      toast.error(errorMes, { theme: 'dark' });
      return;
    }
    try {
      const result: unknown = await fetchRankByUserId(profile?.id, selectedGame, selectedTable.key, selectedTimeFilter);
      if (!result || typeof result !== 'object' || !('ok' in result) || !(result as Response).ok) {
        const errMsg =
          result && typeof result === 'object' && 'text' in result
            ? await (result as Response).text()
            : 'Unknown error';
        toast.error(errMsg, { theme: 'dark' });
        return;
      }
      const res = await (result as Response).json();
      if (res < 1) {
        toast.error(errorMes, { theme: 'dark' });
        return;
      }
      setMyRank(res);
      document?.querySelector('.wen-game-modal')?.parentElement?.click();
    } catch (error) {
      toast.error(errorMsgHandler(error), { theme: 'dark' });
      return;
    }
  };

  const getColumns = () => {
    const columns: Array<{ field: string; headerName: string; width: number; primary?: boolean }> = [
      { field: 'rank', headerName: 'RANK', width: 100, primary: true },
      { field: 'user_id', headerName: 'USERNAME', width: 250, primary: true },
    ];
    selectedTable.rows.forEach((headerCell: TableRowType) => {
      columns.push({ field: headerCell.key, headerName: headerCell.display, width: 250, primary: headerCell.primary });
    });
    return columns;
  };

  return (
    <Box mb={{ xs: 10, sm: 0 }}>
      {!rows ? (
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'absolute',
            display: 'flex',
            height: '70%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {isLoggedIn && (
            <>
              <TopModal
                selectedGame={selectedGame}
                selectedTimeFilter={selectedTimeFilter}
                flag={selectedTable.key}
                ModalIcon={
                  <Box className="wen-game-modal" sx={{ display: 'none' }}>
                    N/A
                  </Box>
                }
                myRank={myRank}
              />
            </>
          )}
          {isLoggedIn && selectedGame !== 'crypto_winter' && (
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-purple)',
                position: { lg: 'absolute' },
                textDecoration: 'underline',
                right: { lg: '0px' },
                cursor: 'pointer',
                display: 'flex',
                lineHeight: '24px',
                justifyContent: 'flex-end',
                fontWeight: 700,
                svg: { mr: '3px' },
                transform: { lg: 'translate(0px, 50%)' },
                mb: { xs: '16px', lg: '0px' },
                zIndex: 1000,
              }}
              onClick={handleCheckYourRank}
            >
              <Image src="/icons/rank_icon.svg" alt="Rank Icon" width={25} height={20} style={{ marginRight: 4 }} />
              RANK
            </Typography>
          )}
          <ResponsiveTable
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={getColumns()}
            showPagination={true}
            data={rows}
            count={count}
          />
        </Box>
      )}
    </Box>
  );
}
