import { Tag } from "../../domain/entities/Tag.entity";

export interface ITagRepository {
  create(tag: Tag): Promise<Tag>;
  findByUserIdAndName(userId: number, name: string): Promise<Tag | null>;
  findByUserId(userId: number): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  update(tag: Tag): Promise<Tag>;
  delete(id: number): Promise<void>;
}
