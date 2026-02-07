import * as jose from 'jose';

// Secret key for JWT - in production, use environment variable
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'creator' | 'brand' | 'admin';
  iat?: number;
  exp?: number;
}

// Generate JWT access token (15 minutes)
export async function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);
}

// Generate JWT refresh token (7 days)
export async function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jose.jwtVerify(token, secret);
    return verified.payload as TokenPayload;
  } catch (err) {
    return null;
  }
}

// Hash password with bcrypt
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Format phone number to E.164
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Add country code if not present (assuming India for now)
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Extract token from header
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
