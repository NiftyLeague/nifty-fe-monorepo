'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { CircularProgress } from '@nl/ui/custom/circular-progress'

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
      <table className="modal-table">
        <thead className="header">
          <tr className="row">
            <th className="cell index" scope="col">
              <code>RANK</code>
            </th>
            <th className="cell ellipsis" scope="col">
              <code>USERNAME</code>
            </th>
            {flag === 'win_rate' && (
              <th className="cell ellipsis" scope="col">
                <code>WIN RATE</code>
              </th>
            )}
            {flag === 'earnings' && (
              <th
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>TOTAL NFTL EARNED</code>
              </th>
            )}
            {selectedGame === 'nifty_smashers' && (
              <th
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>MATCHES PLAYED</code>
              </th>
            )}
            {flag === 'earnings' && (
              <th
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>AVG,NFTL / MATCH</code>
              </th>
            )}
            {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
              <th className="cell ellipsis" scope="col">
                <code>KILLS</code>
              </th>
            )}
            {flag === 'score' && (
              <th className="cell ellipsis" scope="col">
                <code>HIGH SCORE</code>
              </th>
            )}
            {flag === 'burnings' && (
              <th className="cell ellipsis" scope="col">
                <code>NFTL BURNED</code>
              </th>
            )}
          </tr>
        </thead>
        <div className="box-table" style={{ marginTop: '20px' }} />
        <tbody className="body">
          {data ? (
            data.map((i) => (
              <tr className="row first" key={`${i}`}>
                <td className="cell index" style={{ color: '#9ba5bf' }}>
                  <span className={styles.rankBody} style={getTextStyleForRank(i.rank)}>
                    {i.rank}
                  </span>
                  {i.rank === 1 && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && <div className={styles.lineBottomBox} />}
                </td>
                <td
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                  className="cell ellipsis"
                >
                  {i.user_id}
                  {i.rank === 1 && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && <div className={styles.lineBottomBox} />}
                </td>
                {flag === 'win_rate' && <td className="cell ellipsis">{i.stats.win_rate}</td>}
                {flag === 'earnings' && (
                  <td className="cell ellipsis end">
                    {i.stats.earnings}
                    {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && flag === 'earnings' && (
                      <div className={styles.lineBottomBox} />
                    )}
                  </td>
                )}
                {selectedGame === 'nifty_smashers' && (
                  <td
                    style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                    className="cell ellipsis end"
                  >
                    {i.stats.matches}
                    {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && flag === 'earnings' && (
                      <div className={styles.lineBottomBox} />
                    )}
                  </td>
                )}
                {flag === 'earnings' && (
                  <td className="cell ellipsis end">
                    {i.stats['avg_NFTL/match']}
                    {i.rank === 1 && <div className={styles.lineTopBox} />}
                    {i.rank === 10 && <div className={styles.lineBottomBox} />}
                  </td>
                )}
                {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
                  <td className="cell ellipsis end">{i.stats.kills}</td>
                )}
                {selectedGame !== 'nifty_smashers' && (
                  <td
                    style={{ ...getTextStyleForRank(i.rank), fontSize: 14 }}
                    className="cell ellipsis end"
                  >
                    {i.score}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <div className={styles.loadingBox}>
              <CircularProgress />
            </div>
          )}
          {data && (
            <span className={styles.twitterTypography} onClick={handleShareOnTwitter}>
              Share on twitter{' '}
              <Image src="/icons/socials/twitter.svg" alt="Twitter Icon" width={22} height={20} />
            </span>
          )}
        </tbody>
      </table>
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
