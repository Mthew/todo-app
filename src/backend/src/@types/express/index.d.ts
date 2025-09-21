import { AuthTokenPayload } from "@/application/ports/IAuthService";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthTokenPayload;
    }
  }
}
