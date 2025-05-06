declare module 'crypto-browserify' {
  import { Hash, Cipher, Decipher } from 'crypto';

  interface CryptoError extends Error {
    code?: string;
    opensslErrorStack?: string[];
  }

  interface ScryptOptions {
    N?: number;
    r?: number;
    p?: number;
    maxmem?: number;
    cost?: number;
    blockSize?: number;
    parallelization?: number;
  }

  export function createHash(algorithm: string): Hash;
  export function createHmac(algorithm: string, key: string | Buffer): Hash;
  export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Cipher;
  export function createDecipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Decipher;
  export function pbkdf2(
    password: string,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string,
    callback: (err: CryptoError | null, derivedKey: Buffer) => void,
  ): void;
  export function pbkdf2Sync(
    password: string,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string,
  ): Buffer;
  export function randomBytes(size: number): Buffer;
  export function scrypt(
    password: string,
    salt: string | Buffer,
    keylen: number,
    options: ScryptOptions,
    callback: (err: CryptoError | null, derivedKey: Buffer) => void,
  ): void;
  export function scryptSync(password: string, salt: string | Buffer, keylen: number, options: ScryptOptions): Buffer;
}
