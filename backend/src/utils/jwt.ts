import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const JWT_EXPIRY = (process.env.JWT_EXPIRY || '7d') as SignOptions['expiresIn'];

export interface TokenPayload {
  userId: number;
  email: string;
  schoolId: number;
  role: 'teacher' | 'coordinator' | 'admin';
}

export function generateToken(payload: TokenPayload): string {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jsonwebtoken.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
}
