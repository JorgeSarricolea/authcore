import { User } from "../entities/user.entity";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  assignRoles(userId: string, roleIds: string[]): Promise<User>;
  removeRoles(userId: string, roleIds: string[]): Promise<User>;
}
