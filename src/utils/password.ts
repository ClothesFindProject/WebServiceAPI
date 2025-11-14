import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = (plainText: string): Promise<string> => bcrypt.hash(plainText, SALT_ROUNDS);

export const comparePassword = (plainText: string, hash: string): Promise<boolean> => bcrypt.compare(plainText, hash);
