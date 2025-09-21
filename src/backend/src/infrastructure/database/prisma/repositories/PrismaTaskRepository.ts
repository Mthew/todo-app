import { ITaskRepository } from "../../../../application/ports/ITaskRepository";
import { Task } from "../../../../domain/entities";
import { prisma } from "../PrismaClient";
import { TaskMapper } from "../mappers/TaskMapper";

// Helper to include relations in queries
const taskInclude = {
  tags: { include: { tag: true } },
};

export class PrismaTaskRepository implements ITaskRepository {
  async findById(id: number): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
    return task ? TaskMapper.toDomain(task) : null;
  }

  async findByUserId(userId: number): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: taskInclude,
    });
    return tasks.map(TaskMapper.toDomain);
  }

  async save(task: Task): Promise<Task> {
    const savedTask = await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.dueDate,
        userId: task.userId,
        categoryId: task.categoryId,
        tags: {
          create: task.tags.map((tag) => ({ tagId: tag.id! })),
        },
      },
      include: taskInclude,
    });
    return TaskMapper.toDomain(savedTask);
  }

  async update(task: Task): Promise<Task> {
    const updatedTask = await prisma.task.update({
      where: { id: task.id! },
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.dueDate,
        categoryId: task.categoryId,
        tags: {
          // Disconnect all existing tags and connect the new set
          set: task.tags.map((tag) => ({
            taskId_tagId: { taskId: task.id!, tagId: tag.id! },
          })),
        },
      },
      include: taskInclude,
    });
    return TaskMapper.toDomain(updatedTask);
  }

  async delete(id: number): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}
