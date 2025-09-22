import { Tag } from "../../../domain/entities/Tag.entity";
import { ITagRepository } from "../../ports/ITagRepository";
import { CreateTagDTO } from "../../dtos/tag.dto";
import { BadRequestError } from "../../../utils/AppError";

export class CreateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(dto: CreateTagDTO, userId: number): Promise<Tag> {
    // Check if a tag with the same name already exists for this user
    const existingTag = await this.tagRepository.findByUserIdAndName(
      userId,
      dto.name
    );

    if (existingTag) {
      throw new BadRequestError(
        `Tag with name "${dto.name}" already exists for this user`
      );
    }

    // Create the domain entity, enforcing business rules
    const tag = new Tag(null, dto.name, userId);

    // Persist through the repository port
    const savedTag = await this.tagRepository.create(tag);

    return savedTag;
  }
}
