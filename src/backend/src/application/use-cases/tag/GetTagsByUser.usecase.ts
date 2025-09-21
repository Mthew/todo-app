import { Tag } from "../../../domain/entities/Tag.entity";
import { ITagRepository } from "../../ports/ITagRepository";

export class GetTagsByUserUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(userId: number): Promise<Tag[]> {
    return await this.tagRepository.findByUserId(userId);
  }
}
