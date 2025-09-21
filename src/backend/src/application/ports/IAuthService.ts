export interface AuthTokenPayload {
  id: number;
  email: string;
}

export interface IAuthService {
  generateToken(payload: AuthTokenPayload): string;
  verifyToken(token: string): AuthTokenPayload | null;
}
