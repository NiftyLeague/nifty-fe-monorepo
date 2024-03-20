import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute } from '@/utils/session';
import { DeletePlayer } from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { PlayFabId } = req.session.user as User;
  if (PlayFabId) {
    try {
      const data = await DeletePlayer(PlayFabId);
      req.session.destroy();
      res.status(200).json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      res.status(status).json({ message });
    }
  }
}

export default withUserRoute(handler);
