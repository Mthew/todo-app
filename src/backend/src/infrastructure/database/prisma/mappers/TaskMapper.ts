import { Task as PrismaTask, Tag as PrismaTag } from "@prisma/client";
import { Task, Tag } from "../../../../domain/entities";

type PrismaTaskWithRelations = PrismaTask & {
  tags: { tag: PrismaTag }[];
};

export class TaskMapper {
  public static toDomain(prismaTask: PrismaTaskWithRelations): Task {
    return new Task({
      id: prismaTask.id,
      title: prismaTask.title,
      description: prismaTask.description ?? undefined,
      completed: prismaTask.completed,
      priority: prismaTask.priority,
      dueDate: prismaTask.dueDate ?? undefined,
      userId: prismaTask.userId,
      categoryId: prismaTask.categoryId ?? undefined,
      tags: prismaTask.tags.map(
        (t) => new Tag(t.tag.id, t.tag.name, t.tag.userId)
      ),
    });
  }
}
