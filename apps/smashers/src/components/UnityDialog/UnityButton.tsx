'use client';

import Image from 'next/image';
import { Button } from '@nl/ui/base/button';
import useVersion from '@/hooks/useVersion';
import useFlags from '@/hooks/useFlags';

const UnityButton = () => {
  const { isWindows, downloadURL, version } = useVersion();
  const loading = !version && isWindows;
  const { enableWebGL } = useFlags();

  return enableWebGL ? (
    <>
      {isWindows && (
        <a href={downloadURL || ''}>
          <Button variant="default" size="lg" disabled={!isWindows || !version} className="h-full cursor-pointer">
            <Image
              src="/icons/platform/windows.svg"
              alt="Windows Logo"
              width={22}
              height={22}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {loading ? 'Fetching version...' : 'Download'}
          </Button>
        </a>
      )}
      <Button variant="outline" size="lg" className="h-full cursor-pointer">
        <Image
          src="/icons/platform/webgl.svg"
          alt="Webgl Logo"
          width={32}
          height={28}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Browser
      </Button>
    </>
  ) : null;
};

export default UnityButton;
