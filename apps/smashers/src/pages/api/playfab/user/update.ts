import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute, type Session } from '@/utils/session';
import { AddOrUpdateContactEmail, ChangeDisplayName, UpdateAvatarUrl } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import type { User } from '@nl/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { email, displayName, avatar_url } = await req.body;
  const user = session.user as User;
  const EntityToken = user.EntityToken?.EntityToken;
  const SessionTicket = user?.SessionTicket;
  try {
    // Update Account Display Name
    if (displayName && EntityToken) await ChangeDisplayName(displayName, EntityToken);
    // Update Profile Contact Email
    if (email && SessionTicket) await AddOrUpdateContactEmail(email, SessionTicket);
    // Update Profile Avatar
    if (avatar_url && SessionTicket) await UpdateAvatarUrl(avatar_url, SessionTicket);

    res.status(200).json({});
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withUserRoute(handler);
