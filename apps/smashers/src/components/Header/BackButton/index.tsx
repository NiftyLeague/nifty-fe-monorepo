import Link from 'next/link';
import Icon from '@nl/ui/base/Icon';
import styles from '../Navbar/index.module.css';

export default function BackButton() {
  return (
    <Link href="/">
      <div className={styles.logo_container}>
        <Icon
          aria-label="back"
          name="circle-arrow-left"
          color="#fff"
          size={48}
          strokeWidth={4}
          className={styles.logo}
        />
      </div>
    </Link>
  );
}
