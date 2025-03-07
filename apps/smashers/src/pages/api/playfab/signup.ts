import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterPlayFabUser, GenerateCustomID } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import { withSessionRoute } from '@/utils/session';
import type { User } from '@nl/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, rememberMe } = await req.body;
  try {
    const params = { Email: email, Password: password };
    const loginData = await RegisterPlayFabUser(params);
    const { EntityToken, SessionTicket, PlayFabId } = loginData;
    if (SessionTicket) {
      // Generate & link a CustomID for new PlayFab user
      const CustomId = await GenerateCustomID(SessionTicket);
      const user = {
        isLoggedIn: true,
        persistLogin: rememberMe,
        CustomId,
        EntityToken,
        PlayFabId,
        SessionTicket,
      } as User;
      req.session.user = user;
      await req.session.save();
      res.json(user);
    }
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
