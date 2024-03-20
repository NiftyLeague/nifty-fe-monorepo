import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute } from '@/utils/session';
import { LinkProvider } from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, accessToken } = await req.body;
  const { SessionTicket } = req.session.user as User;
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
