import { NextApiRequest, NextApiResponse } from 'next';
import { LoginWithEmailAddress, LoginWithCustomID } from '@/lib/playfab/api';
import { withSessionRoute } from '@/utils/session';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';

const InfoRequestParameters = {
  GetUserAccountInfo: true,
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, rememberMe, CustomId } = await req.body;
  try {
    let loginData;
    if (CustomId) {
      loginData = await LoginWithCustomID({ CustomId });
    } else {
      loginData = await LoginWithEmailAddress({
        Email: email,
        Password: password,
        InfoRequestParameters,
      });
    }
    const { EntityToken, SessionTicket, PlayFabId, InfoResultPayload } = loginData;
    const user = {
      isLoggedIn: true,
      persistLogin: rememberMe ?? req.session.user?.persistLogin,
      EntityToken,
      PlayFabId,
      SessionTicket,
      CustomId: CustomId ?? InfoResultPayload?.AccountInfo?.CustomIdInfo?.CustomId,
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
