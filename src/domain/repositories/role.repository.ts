import { Role } from "../entities/role.entity";

export interface IRoleRepository {
  create(data: Partial<Role>): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: string, data: Partial<Role>): Promise<Role>;
  delete(id: string): Promise<void>;
  assignPermissions(roleId: string, permissionIds: string[]): Promise<Role>;
  removePermissions(roleId: string, permissionIds: string[]): Promise<Role>;
}
