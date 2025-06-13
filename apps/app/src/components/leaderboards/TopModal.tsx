'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TableBody, TableHead, TableRow, Table, TableCell, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { styled } from '@nl/theme';
import { fetchScores } from '@/utils/leaderboard';
import type { DataType, ReturnDataType } from '@/types/leaderboard';
import { LEADERBOARD_GAME_LIST } from '@/constants/leaderboards';
import CustomModal from './CustomModal';
import './modal-table.css';

const TableRoot = styled('div')({
  width: '76%',
  height: '57%',
  margin: '56.6% auto 0',
  position: 'relative',
  overflow: 'hidden',
  '& thead': { position: 'initial !important', display: 'contents !important' },
  '& table': { width: '100%' },
  '& .cell': { height: '40px !important', overflow: 'initial !important', position: 'relative' },
  '& th': { color: '#9ba5bf !important', maxWidth: '60px !important' },
  '& tbody': { position: 'initial !important', '& tr': { '&:first-child': { borderTop: 'solid 2px #8c9cb4' } } },
  '& tr': {
    '& th': { '&:last-child': { borderRight: 'none !important', color: '#9ba5bf !important' } },
    '& td': {
      color: 'var(--color-background)',
      fontWeight: 'bold',
      fontSize: 16,
      '&:last-child': { borderRight: 'none !important' },
    },
  },
});

const RankBody = styled('span')({ padding: '10px', borderRadius: '50px', paddingTop: '5px', paddingBottom: '5px' });

const LineTopBox = styled('div')({
  position: 'absolute',
  top: '-9px',
  right: '-2px',
  height: 15,
  borderRight: 'solid 2px #8c9cb4',
});

const LineBottomBox = styled('div')({
  position: 'absolute',
  bottom: '-9px',
  right: '-2px',
  height: 15,
  borderRight: 'solid 2px #8c9cb4',
});

const LoadingBox = styled('div')({
  width: '100%',
  height: '80%',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  display: 'flex',
});

const TwitterTypography = styled(Typography)({
  width: '100%',
  background: 'var(--color-foreground)',
  color: 'var(--color-blue)',
  fontWeight: 600,
  display: 'flex',
  fontSize: '14px',
  lineHeight: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: '0px',
  marginTop: '10px',
  gap: '10px',
  textDecoration: 'underline',
  cursor: 'pointer',
});

interface TableModalProps {
  selectedGame: string;
  flag: string;
  selectedTimeFilter: string;
  myRank?: number;
}

const TableModal = ({ selectedGame, flag, selectedTimeFilter, myRank }: TableModalProps): React.ReactNode | null => {
  // let d = new Date(),
  //   t = d.toDateString().split(' ');

  const [data, setData] = useState<DataType[]>();

  // get the top ten items
  const fetchDataItems = async () => {
    if (!myRank) {
      return;
    }

    const ret: ReturnDataType = await fetchScores(
      selectedGame,
      flag,
      selectedTimeFilter,
      10,
      myRank < 3 ? 0 : myRank - 3,
    );
    setData(ret.data);
  };

  useEffect(() => {
    fetchDataItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRank]);

  const getTextStyleForRank = (rank: number) => {
    return rank === myRank ? { color: '#E49C8E' } : {};
  };

  // shorten user id letters
  const handleShareOnTwitter = () => {
    const currentGame = LEADERBOARD_GAME_LIST.filter(game => game.key === selectedGame)?.[0];
    if (!currentGame) return;
    const { display } = currentGame;
    const obj = {
      original_referer: 'https://app.niftyleague.com/',
      ref_src: 'twsrc^tfw|twcamp^buttonembed|twterm^share|twgr^',
      text: `I ranked #${myRank} on the ${display} Top Score Leaderboard. Check out @niftyleague games: https://app.niftyleague.com/`,
      hashtags: 'NiftyLeague,NFT,NFTGaming',
    };
    if (typeof window !== 'undefined')
      window.open(`https://twitter.com/intent/tweet?${`${new URLSearchParams(obj)}`}`, '_blank');
  };

  return (
    <TableRoot>
      <Table className="modal-table">
        <TableHead className="header">
          <TableRow className="row">
            <TableCell component="th" className="cell index">
              <code>RANK</code>
            </TableCell>
            <TableCell component="th" className="cell ellipsis">
              <code>USERNAME</code>
            </TableCell>
            {flag === 'win_rate' && (
              <TableCell component="th" className="cell ellipsis">
                <code>WIN RATE</code>
              </TableCell>
            )}
            {flag === 'earnings' && (
              <TableCell component="th" className="cell ellipsis" style={{ fontSize: 10, textAlign: 'center' }}>
                <code>TOTAL NFTL EARNED</code>
              </TableCell>
            )}
            {selectedGame === 'nifty_smashers' && (
              <TableCell component="th" className="cell ellipsis" style={{ fontSize: 10, textAlign: 'center' }}>
                <code>MATCHES PLAYED</code>
              </TableCell>
            )}
            {flag === 'earnings' && (
              <TableCell component="th" className="cell ellipsis" style={{ fontSize: 10, textAlign: 'center' }}>
                <code>AVG,NFTL / MATCH</code>
              </TableCell>
            )}
            {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
              <TableCell component="th" className="cell ellipsis">
                <code>KILLS</code>
              </TableCell>
            )}
            {flag === 'score' && (
              <TableCell component="th" className="cell ellipsis">
                <code>HIGH SCORE</code>
              </TableCell>
            )}
            {flag === 'burnings' && (
              <TableCell component="th" className="cell ellipsis">
                <code>NFTL BURNED</code>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <Box className="box-table" sx={{ marginTop: '20px' }} />
        <TableBody className="body">
          {data ? (
            data.map(i => (
              <TableRow className="row first" key={`${i}`}>
                <TableCell className="cell index" style={{ color: '#9ba5bf' }}>
                  <RankBody style={getTextStyleForRank(i.rank)}>{i.rank}</RankBody>
                  {i.rank === 1 && <LineTopBox />}
                  {i.rank === 10 && <LineBottomBox />}
                </TableCell>
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                  className="cell ellipsis"
                >
                  {i.user_id}
                  {i.rank === 1 && <LineTopBox />}
                  {i.rank === 10 && <LineBottomBox />}
                </TableCell>
                {flag === 'win_rate' && (
                  <TableCell className="cell ellipsis">
                    {i.stats.win_rate}
                    {i.rank === 1 && <LineTopBox />}
                    {i.rank === 10 && <LineBottomBox />}
                  </TableCell>
                )}
                {flag === 'earnings' && (
                  <TableCell className="cell ellipsis end">
                    {i.stats.earnings}
                    {i.rank === 1 && flag === 'earnings' && <LineTopBox />}
                    {i.rank === 10 && flag === 'earnings' && <LineBottomBox />}
                  </TableCell>
                )}
                {selectedGame === 'nifty_smashers' && (
                  <TableCell
                    style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                    className="cell ellipsis end"
                  >
                    {i.stats.matches}
                    {i.rank === 1 && flag === 'earnings' && <LineTopBox />}
                    {i.rank === 10 && flag === 'earnings' && <LineBottomBox />}
                  </TableCell>
                )}
                {flag === 'earnings' && (
                  <TableCell className="cell ellipsis end">
                    {i.stats['avg_NFTL/match']}
                    {i.rank === 1 && <LineTopBox />}
                    {i.rank === 10 && <LineBottomBox />}
                  </TableCell>
                )}
                {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
                  <TableCell className="cell ellipsis end">{i.stats.kills}</TableCell>
                )}
                {selectedGame !== 'nifty_smashers' && (
                  <TableCell style={{ ...getTextStyleForRank(i.rank), fontSize: 14 }} className="cell ellipsis end">
                    {i.score}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <LoadingBox>
              <CircularProgress />
            </LoadingBox>
          )}
          {data && (
            <TwitterTypography variant="body2" onClick={handleShareOnTwitter}>
              Share on twitter <Image src="/icons/socials/twitter.svg" alt="Twitter Icon" width={22} height={20} />
            </TwitterTypography>
          )}
        </TableBody>
      </Table>
    </TableRoot>
  );
};

interface TopModalProps extends TableModalProps {
  ModalIcon: React.ReactNode;
}

const TopModal = ({
  ModalIcon,
  selectedGame,
  flag,
  selectedTimeFilter,
  myRank,
}: TopModalProps): React.ReactNode | null => {
  return (
    <CustomModal
      ModalIcon={ModalIcon}
      child={
        <TableModal selectedGame={selectedGame} flag={flag} selectedTimeFilter={selectedTimeFilter} myRank={myRank} />
      }
      flag={flag}
    />
  );
};
export default TopModal;
