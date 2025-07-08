import { Metadata } from 'next';
import Typography from '@nl/ui/supabase/Typography';
import BackButton from '@/components/Header/BackButton';
import DROP_TABLES from '@/data/droptables.json';
import type { CrateData } from '@/types/droptables';

import styles from './page.module.css';

// Helper function to format percentage
const formatPercentage = (value: string | number): string => {
  if (typeof value === 'number') return `${value}%`;
  return value.endsWith('%') ? value : `${value}%`;
};

interface CrateTableProps {
  data: CrateData;
}

export const metadata: Metadata = { title: 'Loot' };

const CrateTables: React.FC<CrateTableProps> = ({ data }) =>
  Object.keys(data).map(crateKey => {
    const crate = data[crateKey];
    if (!crate) return null;

    return (
      <div key={crate.TableId} className={styles.crateGroup}>
        <Typography.Title level={2}>
          {crateKey
            .split('.')
            .reverse()
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Typography.Title>
        <Typography className="crateSubtitle mb-4">Drop Tables & Odds</Typography>

        {/* Items Table */}
        <div className={styles.itemsTable}>
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
        </div>

        {/* Bonus Item Odds */}
        <Typography.Title level={5} className="mt-4 mb-2">
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

        {/* Currency Rewards */}
        {crate.CurrencyMinMax && Object.keys(crate.CurrencyMinMax).length > 0 && (
          <>
            <Typography.Title level={3} className="mt-4 mb-2">
              Currency Rewards
            </Typography.Title>
            <div className={styles.itemsTable}>
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
            </div>
          </>
        )}
      </div>
    );
  });

export default function Loot() {
  return (
    <div className={styles.pageContainer}>
      <BackButton />
      <div className="w-full text-center mb-6">
        <Typography.Title
          level={1}
          className="mb-2"
          style={{
            background: 'var(--gradient-brand)',
            fontWeight: 800,
            lineHeight: 1.2,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loot Tables
        </Typography.Title>
        <Typography.Title
          level={5}
          className="text-foreground-2"
          style={{ fontWeight: 400, lineHeight: 1.6, maxWidth: '700px', marginInline: 'auto' }}
        >
          Explore the drop rates and rewards for all available crates and loot dives.
        </Typography.Title>
      </div>
      <CrateTables data={DROP_TABLES as CrateData} />
    </div>
  );
}
