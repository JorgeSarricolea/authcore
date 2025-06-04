import { BaseDTO } from "@/core/base.dto";
import { User } from "@/domain/entities/user.entity";

export class UserDTO extends BaseDTO {
  name?: string;
  last_name?: string;
  email: string;
  email_verified: boolean;
  google_id?: string;

  constructor(user: User) {
    super({
      id: user.id,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });

    this.name = user.name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.email_verified = user.email_verified;
    this.google_id = user.google_id;
  }
}
