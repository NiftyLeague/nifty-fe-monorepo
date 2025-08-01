import { NextResponse } from 'next/server';
import { LinkProvider } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils/errorHandlers';
import type { User } from '@nl/playfab/types';

import { withUserRoute } from '@/utils/session';

export const POST = withUserRoute(async (request, session) => {
  const { provider, accessToken } = await request.json();
  const { SessionTicket } = session.user as User;
  if (SessionTicket) {
    try {
      const data = await LinkProvider(provider, accessToken, SessionTicket);
      console.log('===== LinkProvider response =====', data);
      return NextResponse.json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      return NextResponse.json({ message: message || 'Link provider failed' }, { status });
    }
  }
  return NextResponse.json({ message: 'Missing SessionTicket' }, { status: 401 });
});
