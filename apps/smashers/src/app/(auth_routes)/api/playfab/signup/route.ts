import { NextResponse } from 'next/server';
import { RegisterPlayFabUser, GenerateCustomID } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils/errorHandlers';
import type { User } from '@nl/playfab/types';

import { withSessionRoute } from '@/utils/session';

export const POST = withSessionRoute(async (request, session) => {
  const body = await request.json();
  const { email, password, rememberMe } = body;
  try {
    const params = { Email: email, Password: password };
    const loginData = await RegisterPlayFabUser(params);
    const { EntityToken, SessionTicket, PlayFabId } = loginData;
    if (SessionTicket) {
      // Generate & link a CustomID for new PlayFab user
      const CustomId = await GenerateCustomID(SessionTicket);
      const user: User = {
        isLoggedIn: true,
        persistLogin: rememberMe,
        CustomId,
        EntityToken,
        PlayFabId,
        SessionTicket,
      };

      session.user = user;
      await session.save();

      return NextResponse.json(user);
    }
    return NextResponse.json({ message: 'Signup failed' }, { status: 400 });
  } catch (error) {
    const { status, message } = errorResHandler(error);
    return NextResponse.json({ message: message || 'Signup failed' }, { status });
  }
});
