import { NextResponse } from 'next/server';
import { USER_INITIAL_STATE } from '@nl/playfab/constants';
import { playfab } from '@nl/playfab/sdk';

import { withSessionRoute } from '@/utils/session';

const { PlayFabClient } = playfab;

export const GET = withSessionRoute(async (_request, session) => {
  const user = session.user;
  const isLoggedIn = user ? !!PlayFabClient.IsClientLoggedIn(user) : false;
  if (user?.PlayFabId) {
    user.isLoggedIn = isLoggedIn;
    await session.save();
    return NextResponse.json({ ...user, isLoggedIn });
  } else {
    return NextResponse.json(USER_INITIAL_STATE);
  }
});
