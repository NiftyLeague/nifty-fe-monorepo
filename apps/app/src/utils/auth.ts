import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto-browserify';
import type { UUID_Token, Nonce } from '@/types/auth';

export const createUUID = (): UUID_Token =>
  `${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}`;

export const createNonce = (): Nonce => `0x${crypto.randomBytes(4).toString('hex')}`;
