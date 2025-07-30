import { NextResponse } from 'next/server';
import { GetPlayerCombinedInfo, GetUserPublisherData } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils/errorHandlers';
import { USER_INFO_INITIAL_STATE } from '@nl/playfab/constants';
import type { User } from '@nl/playfab/types';

import { withUserRoute } from '@/utils/session';

export const GET = withUserRoute(async (_request, session) => {
  const { SessionTicket } = session.user as User;
  if (SessionTicket) {
    try {
      const player = await GetPlayerCombinedInfo(SessionTicket);
      const publisherData = await GetUserPublisherData(SessionTicket);
      return NextResponse.json({
        ...USER_INFO_INITIAL_STATE,
        ...(player ? player.InfoResultPayload : {}),
        PublisherData: publisherData,
      });
    } catch (error) {
      const { status, message } = errorResHandler(error);
      return NextResponse.json({ message: message || 'Get user info failed' }, { status });
    }
  }
  return NextResponse.json(USER_INFO_INITIAL_STATE);
});
