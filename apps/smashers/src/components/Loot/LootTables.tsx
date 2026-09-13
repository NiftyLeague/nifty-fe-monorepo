import { Typography } from '@nl/ui/custom/typography'
import DROP_TABLES from '@/data/droptables.json'
import type { CrateData } from '@/types/droptables'

import styles from '@/styles/loot.module.css'

const formatPercentage = (value: string | number): string => {
  if (typeof value === 'number') return `${value}%`
  return value.endsWith('%') ? value : `${value}%`
}

/**
 * The tables scroll inside a fixed-height container, so the container needs
 * keyboard access to scroll (axe `scrollable-region-focusable`, M5.6 #1883):
 * focusable, and named as a region so the focus target means something.
 */
const ScrollableTable = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className={styles.itemsTable} role="region" aria-label={label} tabIndex={0}>
    {children}
  </div>
)

interface LootTablesProps {
  data?: CrateData
}

export default function LootTables({ data = DROP_TABLES as CrateData }: LootTablesProps) {
  return (
    <>
      {Object.keys(data).map((crateKey) => {
        const crate = data[crateKey]
        if (!crate) return null

        return (
          <div key={crate.TableId} className={styles.crateGroup}>
            <Typography.Title level={2}>
              {crateKey
                .split('.')
                .toReversed()
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Typography.Title>
            <Typography className="mb-4">Drop Tables & Odds</Typography>

            <ScrollableTable label={`${crateKey} drop items`}>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Rarity</th>
                    <th>Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {crate.Items.map((item, index) => (
                    <tr key={`items-${index}`}>
                      <td data-rarity={item.Rarity?.toLowerCase()}>{item.Item}</td>
                      <td>{item.Type}</td>
                      <td data-rarity={item.Rarity?.toLowerCase()}>{item.Rarity}</td>
                      <td>{formatPercentage(item.Weight)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollableTable>

            {/* Section heading at outline level 3 (the crate name is the h2).
                The level-6 utilities reproduce the original visual size, so the
                outline is correct without changing the look. */}
            <Typography.Title
              level={3}
              className="mt-4 mb-2 text-base font-normal font-subheader tracking-subheader"
            >
              Bonus Item Odds:{' '}
              <span
                style={{
                  background: 'var(--gradient-brand)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {crate.BonusItemOdds}
              </span>
            </Typography.Title>

            {crate.CurrencyMinMax && Object.keys(crate.CurrencyMinMax).length > 0 && (
              <>
                <Typography.Title level={3} className="mt-4 mb-2">
                  Currency Rewards
                </Typography.Title>
                <ScrollableTable label={`${crateKey} currency rewards`}>
                  <table>
                    <thead>
                      <tr>
                        <th>Currency</th>
                        <th>Odds</th>
                        <th>Min</th>
                        <th>Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(crate.CurrencyMinMax).map(([currency, range]) => (
                        <tr key={`range-${currency}`}>
                          <td>{currency}</td>
                          <td>{formatPercentage(crate.CurrencyRewardOdds[currency] ?? '0%')}</td>
                          <td>{range?.MIN ?? 'N/A'}</td>
                          <td>{range?.MAX ?? 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollableTable>
              </>
            )}
          </div>
        )
      })}
    </>
  )
}
