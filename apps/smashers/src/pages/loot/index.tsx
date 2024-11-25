import BackButton from '@/components/BackButton';

import DROP_TABLES from '@/data/dropTables.json';

import styles from '@/styles/droptables.module.css';

type Item = {
  Item: string;
  Type: string;
  Rarity: string;
  Weight: string;
};

type CurrencyRange = {
  MIN: number;
  MAX: number;
};

type Crate = {
  TableId: string;
  Items: Item[];
  BonusItemOdds: string;
  CurrencyRewardOdds: Record<string, string>;
  CurrencyMinMax: Record<string, CurrencyRange>;
};

type CrateData = Record<string, Crate>;

interface CrateTableProps {
  data: CrateData;
}

const CrateTables: React.FC<CrateTableProps> = ({ data }) =>
  Object.keys(data).map(crateKey => {
    const crate = data[crateKey];
    return (
      crate && (
        <div key={crate.TableId} className={styles.crateGroup}>
          <h2 style={{ marginBottom: '1rem' }}>
            {crateKey
              .split('.')
              .reverse()
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}{' '}
            - Drop Tables & Odds
          </h2>

          {/* Items Table */}
          <h5>Items</h5>
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
                  <tr key={index}>
                    <td>{item.Item}</td>
                    <td>{item.Type}</td>
                    <td>{item.Rarity}</td>
                    <td>{item.Weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bonus Item Odds */}
          <h5>Bonus Item Odds</h5>
          <p style={{ fontWeight: 'bold', marginTop: 5, marginBottom: '1.25rem' }}>{crate.BonusItemOdds}</p>

          {/* Currency Reward Odds Table */}
          <h5>Currency Reward Odds</h5>
          <div className={styles.itemsTable}>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Odds</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(crate.CurrencyRewardOdds).map(([currency, odds]) => (
                  <tr key={currency}>
                    <td>{currency}</td>
                    <td>{odds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Currency Min/Max Table */}
          <h5>Currency Min/Max</h5>
          <div className={styles.itemsTable}>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Min</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(crate.CurrencyMinMax).map(([currency, range]) => (
                  <tr key={currency}>
                    <td>{currency}</td>
                    <td>{range.MIN}</td>
                    <td>{range.MAX}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    );
  });

export default function Loot() {
  return (
    <>
      <BackButton />
      <div className={styles.pageContainer}>
        <CrateTables data={DROP_TABLES} />
      </div>
    </>
  );
}
