import { User } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/repositories/user.repository";
import DefaultRoleService from "./default-role.service";
import { IRoleRepository } from "@/domain/repositories/role.repository";

interface GoogleUserData {
  google_id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
}

export default class GoogleOAuthService {
  private defaultRoleService: DefaultRoleService;

  constructor(
    private readonly userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this.defaultRoleService = new DefaultRoleService(roleRepository);
  }

  async findOrCreateGoogleUser(data: GoogleUserData): Promise<User> {
    // Check if user exists with this Google ID
    let user = await this.userRepository.findByGoogleId(data.google_id);

    if (user) {
      return user;
    }

    // Check if user exists with this email
    user = await this.userRepository.findByEmail(data.email);

    if (user) {
      // Update existing user with Google ID
      user.google_id = data.google_id;
      await this.userRepository.update(user.id, { google_id: data.google_id });
      return user;
    }

    // Get default role
    const defaultRole = await this.defaultRoleService.getDefaultRole();

    // Create new user
    const newUser = new User({
      email: data.email,
      name: data.first_name,
      last_name: data.last_name,
      google_id: data.google_id,
      email_verified: data.email_verified,
    });

    const createdUser = await this.userRepository.create(newUser);

    // Assign the default role to the user
    await this.userRepository.assignRoles(createdUser.id, [defaultRole.id]);

    return createdUser;
  }
}
