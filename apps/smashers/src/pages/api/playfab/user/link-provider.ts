import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute, type Session } from '@/utils/session';
import { LinkProvider } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import type { User } from '@nl/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { provider, accessToken } = await req.body;
  const { SessionTicket } = session.user as User;
  if (SessionTicket) {
    try {
      const data = await LinkProvider(provider, accessToken, SessionTicket);
      console.log('===== LinkProvider response =====', data);
      res.status(200).json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      res.status(status).json({ message });
    }
  }
}

export default withUserRoute(handler);
