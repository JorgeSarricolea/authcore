import { Permission } from "./permission.entity";

export class Role {
  id!: string;
  name!: string;
  description?: string;
  created_at!: Date;
  updated_at!: Date;
  permissions?: Permission[];

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
    if (partial.permissions) {
      this.permissions = partial.permissions.map((p) => new Permission(p));
    }
  }
}
