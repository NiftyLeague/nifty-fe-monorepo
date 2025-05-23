import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import { USER_INITIAL_STATE } from '@nl/playfab/constants';
import type { User } from '@nl/playfab/types';

function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json(USER_INITIAL_STATE);
}

export default withSessionRoute(handler);
