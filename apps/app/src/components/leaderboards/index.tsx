'use client';
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { styled } from '@nl/theme';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Box, FormControl, List, ListItemButton, ListItemText, MenuItem, Stack, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { gtm, GTM_EVENTS } from '@nl/ui/gtm';
import type { LeaderboardGame, TableType } from '@/types/leaderboard';
import { LEADERBOARD_GAME_LIST, LEADERBOARD_TIME_FILTERS, NiftySmashersTables } from '@/constants/leaderboards';
import EnhancedTable from '@/components/leaderboards/EnhancedTable/EnhancedTable';
// const TopModal = dynamic(() => import('../TopModal'), { ssr: false });
import './modal-table.css';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: `${theme.spacing(0.25)} ${theme.spacing(1.5)}`,
  '&.Mui-selected': { backgroundColor: 'transparent !important' },
}));

export default function LeaderBoards(): React.ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { game: defaultGame } = Object.fromEntries(searchParams.entries());
  const [selectedGame, setGame] = useState<string>(
    defaultGame && LEADERBOARD_GAME_LIST.some(game => game.key === defaultGame)
      ? defaultGame
      : (LEADERBOARD_GAME_LIST as [LeaderboardGame])[0].key,
  );
  const [selectedTable, setTable] = useState<TableType>(NiftySmashersTables[0] as TableType);
  const [selectedType, setType] = useState<string>((NiftySmashersTables[0] as TableType).key);
  const [selectedTimeFilter, setTimeFilter] = useState<string>('all_time');

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, { content_type: 'leaderboard', content_id: selectedGame });
    if (searchParams.get('game') !== selectedGame) {
      const params = new URLSearchParams(searchParams);
      params.set('game', selectedGame);
      router.push(pathname + '?' + params.toString());
    }
  }, [selectedGame, router, pathname, searchParams]);

  const handleChangeGame = (event: SelectChangeEvent) => {
    const gameKey = event.target.value;
    setGame(gameKey);

    const currentGame = LEADERBOARD_GAME_LIST.filter(game => game.key === gameKey)?.[0];
    if (!currentGame) return;
    const { display, tables } = currentGame;

    if (gameKey === 'nftl_burner' && selectedTimeFilter === 'weekly') {
      // Since NFTL Burner doesn't have weekly leaderboard
      // we will set to default all_time
      setTimeFilter('all_time');
    }
    setTable(tables[0] as TableType);
    setType((tables[0] as TableType).key);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    const table = NiftySmashersTables.find((t: TableType) => t.key === event.target.value);
    if (table) {
      setTable(table);
      setType(table.key);
    }
  };

  const handleChangeTimeFilter = (selected: string) => {
    if (selectedTimeFilter != selected) setTimeFilter(selected);
  };

  // TODO: Enable all times if updated leaderboard incorporated
  const timeFilters = LEADERBOARD_TIME_FILTERS.filter(item => item.key === 'all_time');

  return (
    <Box sx={{ margin: 'auto' }}>
      <Stack direction={{ sm: 'row', xs: 'column' }} alignItems={{ sm: 'center', xs: 'inherit' }} mb={2} spacing={1.5}>
        <FormControl sx={{ minWidth: '164px' }}>
          <Select value={selectedGame} onChange={handleChangeGame} inputProps={{ sx: { paddingY: 0.75 } }}>
            {LEADERBOARD_GAME_LIST.map(item => (
              <MenuItem value={item.key} key={item.key}>
                {item.display}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedGame === 'nifty_smashers' && (
          <FormControl sx={{ minWidth: '120px' }}>
            <Select value={selectedType} onChange={handleChangeType} inputProps={{ sx: { paddingY: 0.75 } }}>
              {NiftySmashersTables.map(item => (
                <MenuItem value={item.key} key={item.key}>
                  {item.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <List sx={{ display: 'flex' }}>
          {timeFilters.map(item => (
            <StyledListItemButton
              key={item.key}
              selected={item.key === selectedTimeFilter}
              onClick={() => handleChangeTimeFilter(item.key)}
            >
              <ListItemText>
                <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'inherit' }}>
                  {item.display}
                </Typography>
              </ListItemText>
            </StyledListItemButton>
          ))}
        </List>
      </Stack>
      <EnhancedTable
        selectedGame={selectedGame}
        selectedTable={selectedTable}
        selectedTimeFilter={selectedTimeFilter}
      />
    </Box>
  );
}
