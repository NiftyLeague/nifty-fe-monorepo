import { NextResponse } from 'next/server';
import { USER_INITIAL_STATE } from '@nl/playfab/constants';

import { withSessionRoute } from '@/utils/session';

export const POST = withSessionRoute(async (_request, session) => {
  session.destroy();
  return NextResponse.json(USER_INITIAL_STATE);
});
