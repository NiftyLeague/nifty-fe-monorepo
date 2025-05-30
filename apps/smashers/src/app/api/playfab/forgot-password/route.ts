import { NextResponse } from 'next/server';
import { SendAccountRecoveryEmail } from '@nl/playfab/api';
import { errorResHandler } from '@nl/playfab/utils';

import { withSessionRoute } from '@/utils/session';

export const POST = withSessionRoute(async (request, _session) => {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }
  try {
    const data = await SendAccountRecoveryEmail(email);
    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    return NextResponse.json({ message: message || 'Forgot password failed' }, { status });
  }
});
