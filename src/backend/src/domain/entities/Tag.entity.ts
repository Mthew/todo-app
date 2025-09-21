import { BadRequestError } from "../../utils/AppError";

export class Tag {
  public readonly id: number | null;
  public name: string;
  public readonly userId: number;

  constructor(id: number | null, name: string, userId: number) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Tag name cannot be empty.");
    }
    if (!userId) {
      throw new BadRequestError("Tag must be associated with a user.");
    }

    this.id = id;
    this.name = name;
    this.userId = userId;
  }
}
