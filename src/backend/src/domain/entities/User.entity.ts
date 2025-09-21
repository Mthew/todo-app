import { BadRequestError } from "../../utils/AppError";

export class User {
  public readonly id: number | null;
  public email: string;
  public name: string;
  public passwordHash: string;

  constructor(
    id: number | null,
    email: string,
    name: string,
    passwordHash: string
  ) {
    if (!email || !email.includes("@")) {
      throw new BadRequestError("A valid email is required for a User.");
    }
    if (!name || name.trim().length === 0) {
      throw new BadRequestError("User name cannot be empty.");
    }
    if (!passwordHash) {
      throw new BadRequestError("A password hash is required for a User.");
    }

    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
  }

  /**
   * Domain behavior method.
   * Updates the user's profile information.
   */
  public updateProfile(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BadRequestError("User name cannot be empty.");
    }
    this.name = name;
  }
}
