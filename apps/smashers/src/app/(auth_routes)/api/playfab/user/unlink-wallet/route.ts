import { NextResponse } from 'next/server';
import { UnlinkWallet } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils/errorHandlers';

import { withUserRoute } from '@/utils/session';

export const POST = withUserRoute(async (request, session) => {
  const body = await request.json();
  const { address, chain } = body;

  const user = session.user;
  const EntityToken = user?.EntityToken?.EntityToken;
  const SessionTicket = user?.SessionTicket;

  if (EntityToken && SessionTicket) {
    try {
      const data = await UnlinkWallet({ address, chain, EntityToken, SessionTicket });
      return NextResponse.json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      return NextResponse.json({ message: message || 'Unlink wallet failed' }, { status });
    }
  }
  return NextResponse.json({ message: 'Missing EntityToken or SessionTicket' }, { status: 401 });
});
