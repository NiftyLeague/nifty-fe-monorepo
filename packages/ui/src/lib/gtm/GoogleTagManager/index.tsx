'use client';

import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google';
import { GOOGLE_TAG_MANAGER_ID } from '../constants';

const GTM = () => <NextGoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />;
export default GTM;
