import jwt from "jsonwebtoken";
import {
  IAuthService,
  AuthTokenPayload,
} from "../../application/ports/IAuthService";

export class JwtAuthService implements IAuthService {
  private readonly secret: string;
  private readonly expiresIn: string | number = "1d";

  constructor() {
    this.secret = process.env.JWT_SECRET as string;
    if (!this.secret) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }
  }

  generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): AuthTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as AuthTokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
