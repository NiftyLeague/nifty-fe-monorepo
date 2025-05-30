import { NextResponse } from 'next/server';
import { AddOrUpdateContactEmail, ChangeDisplayName, UpdateAvatarUrl } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';
import type { User } from '@nl/playfab/types';

import { withUserRoute } from '@/utils/session';

export const POST = withUserRoute(async (request, session) => {
  const body = await request.json();
  const { email, displayName, avatar_url } = body;

  const user = session.user as User;
  const EntityToken = user.EntityToken?.EntityToken;
  const SessionTicket = user?.SessionTicket;

  try {
    let result = {};
    // Update Account Display Name
    if (displayName && EntityToken) result = await ChangeDisplayName(displayName, EntityToken);
    // Update Profile Contact Email
    if (email && SessionTicket) result = await AddOrUpdateContactEmail(email, SessionTicket);
    // Update Profile Avatar
    if (avatar_url && SessionTicket) result = await UpdateAvatarUrl(avatar_url, SessionTicket);

    return NextResponse.json(result);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    return NextResponse.json({ message: message || 'Update user failed' }, { status });
  }
});
