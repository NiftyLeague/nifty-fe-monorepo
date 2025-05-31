import { NextResponse } from 'next/server';
import { LinkWallet } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';

import { withUserRoute } from '@/utils/session';

export const POST = withUserRoute(async (request, session) => {
  const body = await request.json();
  const { address, signature, nonce } = body;

  const user = session.user;
  const EntityToken = user?.EntityToken?.EntityToken;
  const SessionTicket = user?.SessionTicket;

  if (EntityToken && SessionTicket) {
    try {
      const data = await LinkWallet({
        address,
        signature,
        nonce,
        EntityToken,
        SessionTicket,
      });
      return NextResponse.json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      return NextResponse.json({ message: message || 'Link wallet failed' }, { status });
    }
  }
  return NextResponse.json({ message: 'Missing EntityToken or SessionTicket' }, { status: 401 });
});
