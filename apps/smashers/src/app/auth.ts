import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/auth.config';

export const getSession = () => getServerSession(authOptions);
