import { Role } from "./role.entity";

export class User {
  id!: string;
  email!: string;
  password?: string;
  name?: string;
  last_name?: string;
  google_id?: string;
  email_verified!: boolean;
  email_verification_code?: string;
  email_verification_expires?: Date;
  created_at!: Date;
  updated_at!: Date;
  reset_token?: string;
  reset_token_exp?: Date;
  roles?: Role[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (partial.roles) {
      this.roles = partial.roles.map((role) => new Role(role));
    }
  }
}
