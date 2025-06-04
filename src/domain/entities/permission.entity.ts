export class Permission {
  id!: string;
  name!: string;
  description?: string;
  created_at!: Date;
  updated_at!: Date;

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }
}
