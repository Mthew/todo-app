import { ITagRepository } from "../../../../application/ports/ITagRepository";
import { Tag } from "../../../../domain/entities/Tag.entity";
import { prisma } from "../PrismaClient";
import { TagMapper } from "../mappers";

export class PrismaTagRepository implements ITagRepository {
  async create(tag: Tag): Promise<Tag> {
    const savedTag = await prisma.tag.create({
      data: {
        name: tag.name,
        userId: tag.userId,
      },
    });
    return TagMapper.toDomain(savedTag);
  }

  async findByUserIdAndName(userId: number, name: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
    return tag ? TagMapper.toDomain(tag) : null;
  }

  async findByUserId(userId: number): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    return tags.map(TagMapper.toDomain);
  }

  async findById(id: number): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    return tag ? TagMapper.toDomain(tag) : null;
  }

  async update(tag: Tag): Promise<Tag> {
    const updatedTag = await prisma.tag.update({
      where: { id: tag.id! },
      data: {
        name: tag.name,
      },
    });
    return TagMapper.toDomain(updatedTag);
  }

  async delete(id: number): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }
}
