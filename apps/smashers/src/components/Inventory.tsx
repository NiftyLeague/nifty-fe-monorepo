import Auth from '@/lib/playfab/components/Auth';

import styles from '@/styles/profile.module.css';

export default function Inventory() {
  const { currencies, isLoggedIn } = Auth.useUserContext();
  return isLoggedIn ? (
    <>
      <label htmlFor="inventory">Currencies</label>
      <div className={styles.currencyContainer}>
        <input
          id="T1"
          className={styles.currency}
          type="text"
          value={`Brawl Bucks:  ${currencies?.T1 || 0} `}
          disabled
        />
        <input
          id="T2"
          className={styles.currency}
          type="text"
          value={`Nifty Nuggets:  ${currencies?.T2 || 0} `}
          disabled
        />
      </div>
      <hr className={styles.hr} />
      <label htmlFor="characters">Characters</label>
      <div>coming soon...</div>
      <hr className={styles.hr} />
      <label htmlFor="characters">Items</label>
      <div>coming soon...</div>
    </>
  ) : null;
}
