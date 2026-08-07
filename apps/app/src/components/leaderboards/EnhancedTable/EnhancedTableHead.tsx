import Image from 'next/image'
import type { EnhancedTableProps } from '@/types/leaderboard'
import { Title } from '@nl/ui/custom/typography'

export default function EnhancedTableHead(props: EnhancedTableProps): React.ReactNode | null {
  const { rows, handleCheckYourRank } = props
  return (
    <thead>
      <tr>
        <th align="left" className="px-4 py-3 text-sm">
          RANK
        </th>
        <th align="left" className="px-4 py-3 text-sm">
          USERNAME
        </th>
        {rows.map((headCell) => (
          <th key={headCell.key} align="left" className="px-4 py-3 text-sm" scope="col">
            {headCell.display}
          </th>
        ))}
        <th align="right" className="px-4 py-3 text-sm" scope="col">
          <span
            onClick={handleCheckYourRank}
            className="cursor-pointer font-bold text-[var(--color-purple)] underline"
            style={{ lineHeight: '24px' }}
          >
            <Title level={4} className="flex items-center justify-end" style={{ marginBottom: 0 }}>
              <Image
                src="/icons/rank_icon.svg"
                alt="Rank Icon"
                width={25}
                height={20}
                style={{ marginRight: 4 }}
              />
              RANK
            </Title>
          </span>
        </th>
      </tr>
    </thead>
  )
}
