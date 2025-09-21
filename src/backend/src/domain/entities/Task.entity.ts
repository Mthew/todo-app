import { Priority } from "domain/enums/Task.types";
import { Tag } from "./Tag.entity";
import { BadRequestError } from "../../utils/AppError";

export interface TaskProps {
  id: number | null;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  userId: number;
  categoryId?: number;
  tags: Tag[]; // A task holds a list of its associated Tag entities.
}

export class Task {
  public readonly id: number | null;
  public title: string;
  public description?: string;
  public completed: boolean;
  public priority: Priority;
  public dueDate?: Date;
  public readonly userId: number;
  public categoryId?: number;
  public tags: Tag[];

  constructor(props: TaskProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new BadRequestError("Task title cannot be empty.");
    }
    if (!props.userId) {
      throw new BadRequestError("Task must be associated with a user.");
    }

    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.completed = props.completed;
    this.priority = props.priority;
    this.dueDate = props.dueDate;
    this.userId = props.userId;
    this.categoryId = props.categoryId;
    this.tags = props.tags;
  }

  // --- Business Logic Methods (Domain Behavior) ---

  public markAsComplete(): void {
    this.completed = true;
  }

  public markAsIncomplete(): void {
    this.completed = false;
  }

  public isOverdue(): boolean {
    if (this.completed || !this.dueDate) {
      return false;
    }
    // This logic is independent of any framework. It's pure business rule.
    return this.dueDate < new Date();
  }

  public changePriority(newPriority: Priority): void {
    this.priority = newPriority;
  }

  public updateDetails(details: {
    title?: string;
    description?: string;
  }): void {
    if (details.title && details.title.trim().length === 0) {
      throw new BadRequestError("Task title cannot be empty.");
    }
    if (details.title) {
      this.title = details.title;
    }
    if (details.description !== undefined) {
      this.description = details.description;
    }
  }

  public assignToCategory(categoryId: number): void {
    this.categoryId = categoryId;
  }

  public addTag(tag: Tag): void {
    // Prevent duplicate tags
    if (!this.tags.some((t) => t.id === tag.id)) {
      this.tags.push(tag);
    }
  }

  public removeTag(tagId: number): void {
    this.tags = this.tags.filter((t) => t.id !== tagId);
  }
}
