import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute } from '@/utils/session';
import { GetPlayerCombinedInfo, GetUserPublisherData } from '@nl/playfab/api';
import { USER_INFO_INITIAL_STATE } from '@nl/playfab/constants';
import type { User, UserInfo } from '@nl/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse<UserInfo>) {
  const { SessionTicket } = req.session.user as User;
  if (SessionTicket) {
    try {
      const player = await GetPlayerCombinedInfo(SessionTicket);
      const publisherData = await GetUserPublisherData(SessionTicket);

      res.json({
        ...USER_INFO_INITIAL_STATE,
        ...(player ? player.InfoResultPayload : {}),
        PublisherData: publisherData,
      });
    } catch (error) {
      res.status(200).json(USER_INFO_INITIAL_STATE);
    }
  }
}

export default withUserRoute(handler);
