'use client';

import Image from 'next/image';
import Button from '@nl/ui/supabase/Button';
import useVersion from '@/hooks/useVersion';
import useFlags from '@/hooks/useFlags';
import styles from '@/styles/modal.module.css';

const UnityButton = ({ launchGame }: { launchGame: () => void }) => {
  const { isWindows, downloadURL, version } = useVersion();
  const loading = !version && isWindows;
  const { enableWebGL } = useFlags();

  return enableWebGL ? (
    <>
      {isWindows && (
        <a href={downloadURL || ''}>
          <Button
            block
            disabled={!isWindows || !version}
            className={styles.button_primary}
            icon={
              <Image
                src="/icons/platform/windows.svg"
                alt="Windows Logo"
                width={22}
                height={22}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            }
            placeholder="Fetching version..."
          >
            {loading ? 'Fetching version...' : 'Download'}
          </Button>
        </a>
      )}
      <Button
        block
        onClick={launchGame}
        className={styles.button_primary}
        icon={
          <Image
            src="/icons/platform/webgl.svg"
            alt="Webgl Logo"
            width={22}
            height={22}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        }
        placeholder="Browser"
      >
        Browser
      </Button>
    </>
  ) : null;
};

export default UnityButton;
