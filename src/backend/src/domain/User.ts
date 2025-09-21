export class User {
  constructor(
    public readonly id: number | null,
    public email: string,
    public name: string,
    public passwordHash: string
  ) {
    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }
  }
}
