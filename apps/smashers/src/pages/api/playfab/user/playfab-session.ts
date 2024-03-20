import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import { USER_INITIAL_STATE } from '@/lib/playfab/constants';
import type { User } from '@/lib/playfab/types';
import { playfab } from '@/lib/playfab/sdk';

const { PlayFabClient } = playfab;

async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  const user = req.session.user;
  const isLoggedIn = PlayFabClient.IsClientLoggedIn(user);
  if (user) {
    user.isLoggedIn = isLoggedIn;
    await req.session.save();
    res.json({
      ...user,
      isLoggedIn,
    });
  } else {
    res.json(USER_INITIAL_STATE);
  }
}

export default withSessionRoute(handler);
