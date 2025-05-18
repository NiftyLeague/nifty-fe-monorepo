import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, type Session } from '@/utils/session';
import { USER_INITIAL_STATE } from '@nl/playfab/constants';
import { playfab } from '@nl/playfab/sdk';
import type { User } from '@nl/playfab/types';

const { PlayFabClient } = playfab;

async function handler(req: NextApiRequest, res: NextApiResponse<User>, session: Session) {
  const user = session.user;
  const isLoggedIn = PlayFabClient.IsClientLoggedIn(user);
  if (session.user?.PlayFabId) {
    session.user.isLoggedIn = isLoggedIn;
    await session.save();
    res.json({ ...session.user, isLoggedIn });
  } else {
    res.json(USER_INITIAL_STATE);
  }
}

export default withSessionRoute(handler);
