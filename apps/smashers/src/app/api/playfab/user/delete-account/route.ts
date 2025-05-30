import { NextResponse } from 'next/server';
import { DeletePlayer } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import type { User } from '@nl/playfab/types';

import { withUserRoute } from '@/utils/session';

export const POST = withUserRoute(async (_request, session) => {
  const { PlayFabId } = session.user as User;
  if (PlayFabId) {
    try {
      const data = await DeletePlayer(PlayFabId);
      session.destroy();
      return NextResponse.json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      return NextResponse.json({ message: message || 'Delete account failed' }, { status });
    }
  }
  return NextResponse.json({ message: 'Missing PlayFabId' }, { status: 400 });
});
