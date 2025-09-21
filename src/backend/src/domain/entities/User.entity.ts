// Note: We are not extending the base Entity here because the ID management is slightly different.
// A new user doesn't have an ID until it's persisted.
export class User {
  // Properties
  public readonly id: number | null;
  public email: string;
  public name: string;
  public passwordHash: string; // The domain only cares about the hash, not the plaintext password.

  /**
   * The constructor is the gatekeeper for creating a valid User.
   * It enforces the entity's invariants (rules that must always be true).
   */
  constructor(
    id: number | null,
    email: string,
    name: string,
    passwordHash: string
  ) {
    if (!email || !email.includes("@")) {
      throw new Error("A valid email is required for a User.");
    }
    if (!name || name.trim().length === 0) {
      throw new Error("User name cannot be empty.");
    }
    if (!passwordHash) {
      throw new Error("A password hash is required for a User.");
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
      throw new Error("User name cannot be empty.");
    }
    this.name = name;
  }
}
