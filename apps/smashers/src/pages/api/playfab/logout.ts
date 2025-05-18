import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, type Session } from '@/utils/session';
import { USER_INITIAL_STATE } from '@nl/playfab/constants';
import type { User } from '@nl/playfab/types';

function handler(req: NextApiRequest, res: NextApiResponse<User>, session: Session) {
  session.destroy();
  res.json(USER_INITIAL_STATE);
}

export default withSessionRoute(handler);
