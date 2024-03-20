import { NextApiRequest, NextApiResponse } from 'next';
import { SendAccountRecoveryEmail } from '@/lib/playfab/api';
import { withSessionRoute } from '@/utils/session';
import { errorResHandler } from '@/utils/errorHandlers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = await req.body;
  try {
    const data = await SendAccountRecoveryEmail(email);
    res.status(200).json(data);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
