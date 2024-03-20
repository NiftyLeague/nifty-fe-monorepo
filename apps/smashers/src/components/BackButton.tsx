import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/navbar.module.css';

export default function BackButton() {
  return (
    <Link href="/">
      <div className={styles.logo_container}>
        <Image
          src="/icons/back.svg"
          alt="Back Button"
          className={styles.logo}
          width={45}
          height={45}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </Link>
  );
}
