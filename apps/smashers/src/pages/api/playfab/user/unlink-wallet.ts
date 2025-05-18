import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute, type Session } from '@/utils/session';
import { UnlinkWallet } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { address, chain } = await req.body;
  const user = session.user;
  const EntityToken = user?.EntityToken?.EntityToken;
  const SessionTicket = user?.SessionTicket;
  if (EntityToken && SessionTicket) {
    try {
      const data = await UnlinkWallet({
        address,
        chain,
        EntityToken,
        SessionTicket,
      });
      res.status(200).json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      res.status(status).json({ message });
    }
  }
}

export default withUserRoute(handler);
