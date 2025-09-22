import { ITaskRepository } from "../../../../application/ports/ITaskRepository";
import { Task } from "../../../../domain/entities";
import { TaskFilterDTO } from "../../../../application/dtos/task.dto";
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

  async findByUserIdWithFilters(
    userId: number,
    filters: TaskFilterDTO
  ): Promise<{ tasks: Task[]; total: number }> {
    const where: any = { userId };

    // Text search in title and description
    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Status filter
    if (filters.completed !== undefined) {
      where.completed = filters.completed;
    }

    // Priority filter
    if (filters.priority) {
      where.priority = filters.priority;
    }

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Date range filters
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) {
        where.dueDate.gte = new Date(filters.dueDateFrom);
      }
      if (filters.dueDateTo) {
        where.dueDate.lte = new Date(filters.dueDateTo);
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (filters.orderBy) {
      const direction = filters.orderDirection || "asc";
      orderBy[filters.orderBy] = direction;
    } else {
      // Default order by createdAt desc
      orderBy.createdAt = "desc";
    }

    // Calculate skip for pagination
    const skip = (filters.page - 1) * filters.limit;

    // Execute count and data queries
    const [total, tasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy,
        skip,
        take: filters.limit,
      }),
    ]);

    return {
      tasks: tasks.map(TaskMapper.toDomain),
      total,
    };
  }
}
