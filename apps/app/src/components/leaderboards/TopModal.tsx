'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  TableBody,
  TableHead,
  TableRow,
  Table,
  TableCell,
  CircularProgress,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

import { fetchScores } from '@/utils/leaderboard'
import type { DataType, ReturnDataType } from '@/types/leaderboard'
import { LEADERBOARD_GAME_LIST } from '@/constants/leaderboards'
import CustomModal from './CustomModal'
import './modal-table.css'

import styles from './TopModal.module.css'

interface TableModalProps {
  selectedGame: string
  flag: string
  selectedTimeFilter: string
  myRank?: number
}

const TableModal = ({
  selectedGame,
  flag,
  selectedTimeFilter,
  myRank,
}: TableModalProps): React.ReactNode | null => {
  const [data, setData] = useState<DataType[]>()

  // get the top ten items
  const fetchDataItems = async () => {
    if (!myRank) {
      return
    }

    const ret: ReturnDataType = await fetchScores(
      selectedGame,
      flag,
      selectedTimeFilter,
      10,
      myRank < 3 ? 0 : myRank - 3
    )
    setData(ret.data)
  }

  useEffect(() => {
    fetchDataItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRank])

  const getTextStyleForRank = (rank: number) => {
    return rank === myRank ? { color: '#E49C8E' } : {}
  }

  // shorten user id letters
  const handleShareOnTwitter = () => {
    const currentGame = LEADERBOARD_GAME_LIST.filter((game) => game.key === selectedGame)?.[0]
    if (!currentGame) return
    const { display } = currentGame
    const obj = {
      original_referer: 'https://app.niftyleague.com/',
      ref_src: 'twsrc^tfw|twcamp^buttonembed|twterm^share|twgr^',
      text: `I ranked #${myRank} on the ${display} Top Score Leaderboard. Check out @niftyleague games: https://app.niftyleague.com/`,
      hashtags: 'NiftyLeague,NFT,NFTGaming',
    }
    if (typeof window !== 'undefined')
      window.open(`https://twitter.com/intent/tweet?${`${new URLSearchParams(obj)}`}`, '_blank')
  }

  return (
    <div className={styles.tableRoot}>
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
              <TableCell
                component="th"
                className="cell ellipsis"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>TOTAL NFTL EARNED</code>
              </TableCell>
            )}
            {selectedGame === 'nifty_smashers' && (
              <TableCell
                component="th"
                className="cell ellipsis"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>MATCHES PLAYED</code>
              </TableCell>
            )}
            {flag === 'earnings' && (
              <TableCell
                component="th"
                className="cell ellipsis"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
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
            data.map((i) => (
              <TableRow className="row first" key={`${i}`}>
                <TableCell className="cell index" style={{ color: '#9ba5bf' }}>
                  <span className={styles.rankBody} style={getTextStyleForRank(i.rank)}>
                    {i.rank}
                  </span>
                  {i.rank === 1 && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && <div className={styles.lineBottomBox} />}
                </TableCell>
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                  className="cell ellipsis"
                >
                  {i.user_id}
                  {i.rank === 1 && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && <div className={styles.lineBottomBox} />}
                </TableCell>
                {flag === 'win_rate' && (
                  <TableCell className="cell ellipsis">
                    {i.stats.win_rate}
                    {i.rank === 1 && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && <div className={styles.lineBottomBox} />}
                  </TableCell>
                )}
                {flag === 'earnings' && (
                  <TableCell className="cell ellipsis end">
                    {i.stats.earnings}
                    {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && flag === 'earnings' && (
                      <div className={styles.lineBottomBox} />
                    )}
                  </TableCell>
                )}
                {selectedGame === 'nifty_smashers' && (
                  <TableCell
                    style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                    className="cell ellipsis end"
                  >
                    {i.stats.matches}
                    {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && flag === 'earnings' && (
                      <div className={styles.lineBottomBox} />
                    )}
                  </TableCell>
                )}
                {flag === 'earnings' && (
                  <TableCell className="cell ellipsis end">
                    {i.stats['avg_NFTL/match']}
                    {i.rank === 1 && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && <div className={styles.lineBottomBox} />}
                  </TableCell>
                )}
                {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
                  <TableCell className="cell ellipsis end">{i.stats.kills}</TableCell>
                )}
                {selectedGame !== 'nifty_smashers' && (
                  <TableCell
                    style={{ ...getTextStyleForRank(i.rank), fontSize: 14 }}
                    className="cell ellipsis end"
                  >
                    {i.score}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <div className={styles.loadingBox}>
              <CircularProgress />
            </div>
          )}
          {data && (
            <Typography
              className={styles.twitterTypography}
              variant="body2"
              onClick={handleShareOnTwitter}
            >
              Share on twitter{' '}
              <Image src="/icons/socials/twitter.svg" alt="Twitter Icon" width={22} height={20} />
            </Typography>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface TopModalProps extends TableModalProps {
  ModalIcon: React.ReactNode
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
        <TableModal
          selectedGame={selectedGame}
          flag={flag}
          selectedTimeFilter={selectedTimeFilter}
          myRank={myRank}
        />
      }
      flag={flag}
    />
  )
}
export default TopModal
