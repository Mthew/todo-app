import { BadRequestError } from "../../utils/AppError";

export class Category {
  public readonly id: number | null;
  public name: string;
  public readonly userId: number; // A category must belong to a user.

  constructor(id: number | null, name: string, userId: number) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Category name cannot be empty.");
    }
    if (!userId) {
      throw new BadRequestError("Category must be associated with a user.");
    }

    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BadRequestError("Category name cannot be empty.");
    }
    this.name = newName;
  }
}
