import { Metadata } from 'next';
import { Box, Typography } from '@mui/material';
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
      <Box key={crate.TableId} className={styles.crateGroup}>
        <Typography variant="h2">
          {crateKey
            .split('.')
            .reverse()
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Typography>
        <Typography className="crateSubtitle" sx={{ mb: 4 }}>
          Drop Tables & Odds
        </Typography>

        {/* Items Table */}
        <Box className={styles.itemsTable}>
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
        </Box>

        {/* Bonus Item Odds */}
        <Typography variant="h3" sx={{ mt: 4, mb: 2, fontSize: '1.25rem', fontWeight: 600 }}>
          Bonus Item Odds:{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, var(--color-brand-purple), var(--color-brand-blue))',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {crate.BonusItemOdds}
          </span>
        </Typography>

        {/* Currency Rewards */}
        {crate.CurrencyMinMax && Object.keys(crate.CurrencyMinMax).length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 4, mb: 2, fontSize: '1.25rem', fontWeight: 600 }}>
              Currency Rewards
            </Typography>
            <Box className={styles.itemsTable}>
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
            </Box>
          </>
        )}
      </Box>
    );
  });

export default function Loot() {
  return (
    <Box className={styles.pageContainer}>
      <BackButton />
      <Box sx={{ width: '100%', textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h1"
          sx={{
            background: 'linear-gradient(90deg, var(--color-brand-purple), var(--color-brand-blue))',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 2,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loot Tables
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontWeight: 400, lineHeight: 1.6, maxWidth: '700px', mx: 'auto' }}
        >
          Explore the drop rates and rewards for all available crates and loot boxes.
        </Typography>
      </Box>
      <CrateTables data={DROP_TABLES as CrateData} />
    </Box>
  );
}
