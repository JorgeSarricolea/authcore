import { Permission } from "../entities/permission.entity";

export interface IPermissionRepository {
  create(data: Partial<Permission>): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  update(id: string, data: Partial<Permission>): Promise<Permission>;
  delete(id: string): Promise<void>;
}
