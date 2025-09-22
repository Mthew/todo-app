import { Tag as PrismaTag } from "@prisma/client";
import { Tag } from "../../../../domain/entities/Tag.entity";

export class TagMapper {
  public static toDomain(prismaTag: PrismaTag): Tag {
    return new Tag(prismaTag.id, prismaTag.name, prismaTag.userId);
  }

  public static toPrisma(tag: Tag) {
    return {
      id: tag.id ?? undefined,
      name: tag.name,
      userId: tag.userId,
    };
  }
}
