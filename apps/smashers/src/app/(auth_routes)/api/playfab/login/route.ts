import { NextResponse } from 'next/server';
import { LoginWithEmailAddress, LoginWithCustomID } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import type { User } from '@nl/playfab/types';

import { withSessionRoute } from '@/utils/session';

const InfoRequestParameters = {
  GetUserAccountInfo: true,
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

export const POST = withSessionRoute(async (request, session) => {
  const body = await request.json();
  const { email, password, rememberMe, CustomId } = body;
  try {
    const loginData = CustomId
      ? await LoginWithCustomID({ CustomId })
      : await LoginWithEmailAddress({
          Email: email,
          Password: password,
          InfoRequestParameters,
        });

    const { EntityToken, SessionTicket, PlayFabId, InfoResultPayload } = loginData;
    const timestamp = new Date().toISOString();
    const user: User = {
      isLoggedIn: true,
      persistLogin: rememberMe ?? session.user?.persistLogin,
      EntityToken,
      PlayFabId,
      SessionTicket,
      CustomId: CustomId ?? InfoResultPayload?.AccountInfo?.CustomIdInfo?.CustomId,
      lastLogin: timestamp,
    };

    session.user = user;
    await session.save();

    console.log('Successful login', {
      userId: loginData.PlayFabId,
      method: CustomId ? 'customId' : 'email',
      timestamp,
    });

    return NextResponse.json(user);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    return NextResponse.json({ message: message || 'Login failed' }, { status });
  }
});
