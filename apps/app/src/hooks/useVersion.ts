'use client';

import { useState, useEffect } from 'react';
import { isWindows, isMacOs } from 'react-device-detect';
import { DEGEN_BASE_API_URL } from '@/constants/url';
import { TARGET_NETWORK } from '@/constants/networks';

const useVersion = () => {
  const [version, setVersion] = useState('');
  const env = TARGET_NETWORK.chainId === 1 ? 'prod' : 'stage';
  const isLinux = window?.navigator?.userAgent?.indexOf('Linux') >= 0;
  let os = isWindows && 'win';
  let message = isWindows && 'Download for Windows';

  if (isLinux) {
    message = 'Linux support is not available at this time';
    os = 'linux';
  }
  if (isMacOs) {
    message = 'Download for Mac OS not available';
    os = 'osx';
  }

  const fileName = `NiftyLauncher-setup-${version.substring(0, version.indexOf('-'))}.exe`;
  const downloadURL = `https://d7ct17ettlkln.cloudfront.net/launcher/${env}/${os}/${version}/${fileName}`;

  useEffect(() => {
    const fetchVersion = async () => {
      const v: string = await fetch(`${DEGEN_BASE_API_URL}/launcher/${env}/${os}/version.bin?t=${Date.now()}`)
        .then(async res => {
          if (res.status >= 400) {
            console.error(await res.text());
            return '';
          }
          return res.text();
        })
        .catch(e => {
          console.error(e);
          return '';
        });
      setVersion(v);
    };
    fetchVersion();
  }, [env, os]);

  return { downloadURL, version, isWindows, isLinux, isMacOs, message };
};

export default useVersion;
