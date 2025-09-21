import { User } from "../../domain/entities/User.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
