import { Role } from "@/domain/entities/role.entity";
import { IRoleRepository } from "@/domain/repositories/role.repository";
import AppException from "@/shared/utils/exception.util";

export default class DefaultRoleService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async getDefaultRole(): Promise<Role> {
    const role = await this.roleRepository.findByName("user");
    if (!role) {
      throw new AppException("Default role not found", 500);
    }
    return role;
  }
}
