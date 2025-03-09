declare module 'crypto-browserify' {
  import { Hash } from 'crypto';
  export function createHash(algorithm: string): Hash;
  export function createHmac(algorithm: string, key: string | Buffer): Hash;
  export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): any;
  export function createDecipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): any;
  export function pbkdf2(
    password: string,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string,
    callback: (err: any, derivedKey: Buffer) => void,
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
    options: object,
    callback: (err: any, derivedKey: Buffer) => void,
  ): void;
  export function scryptSync(password: string, salt: string | Buffer, keylen: number, options: object): Buffer;
}
