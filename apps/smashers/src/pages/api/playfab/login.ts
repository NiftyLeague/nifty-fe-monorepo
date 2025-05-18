import { NextApiRequest, NextApiResponse } from 'next';
import { LoginWithEmailAddress, LoginWithCustomID } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import { withSessionRoute, SESSION_TIMEOUT, type Session } from '@/utils/session';
import type { User } from '@nl/playfab/types';

const InfoRequestParameters = {
  GetUserAccountInfo: true,
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, rememberMe, CustomId } = await req.body;
    if (!CustomId && (!email || !password)) {
      return res.status(400).json({ message: 'Missing required credentials' });
    }

    const loginData = CustomId
      ? await LoginWithCustomID({ CustomId })
      : await LoginWithEmailAddress({
          Email: email!,
          Password: password!,
          InfoRequestParameters,
        });

    const { EntityToken, SessionTicket, PlayFabId, InfoResultPayload } = loginData;
    const timestamp = new Date().toISOString();
    const user = {
      isLoggedIn: true,
      persistLogin: rememberMe ?? session.user?.persistLogin,
      EntityToken,
      PlayFabId,
      SessionTicket,
      CustomId: CustomId ?? InfoResultPayload?.AccountInfo?.CustomIdInfo?.CustomId,
      lastLogin: timestamp,
    } as User;

    session.user = user;
    await session.save();

    console.log('Successful login', {
      userId: loginData.PlayFabId,
      method: CustomId ? 'customId' : 'email',
      timestamp,
    });

    const sessionExpires = new Date(
      Date.now() + (rememberMe ? SESSION_TIMEOUT.remember : SESSION_TIMEOUT.default) * 1000,
    );

    return res.json({ ...user, expires: sessionExpires.toISOString() });
  } catch (error) {
    const { status, message } = errorResHandler(error);
    console.error('Login error:', { error, timestamp: new Date().toISOString() });
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
