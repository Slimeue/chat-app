import * as bcrypt from 'bcrypt';
import { Request } from 'express';

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const generateSalt = async (rounds: number): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(rounds);
    return salt;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (err) {
    throw new Error(err.message);
  }
};
