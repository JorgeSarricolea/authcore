import { PrismaClient, Prisma } from '@prisma/client';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapToEntity(prismaUser: any): User {
    return new User({
      ...prismaUser,
      password: prismaUser.password ?? undefined,
      name: prismaUser.name ?? undefined,
      last_name: prismaUser.last_name ?? undefined,
      google_id: prismaUser.google_id ?? undefined,
      email_verification_code: prismaUser.email_verification_code ?? undefined,
      email_verification_expires:
        prismaUser.email_verification_expires ?? undefined,
      reset_token: prismaUser.reset_token ?? undefined,
      reset_token_exp: prismaUser.reset_token_exp ?? undefined,
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email!,
        password: data.password,
        name: data.name,
        last_name: data.last_name,
        google_id: data.google_id,
        email_verified: data.email_verified!,
        email_verification_code: data.email_verification_code,
        email_verification_expires: data.email_verification_expires,
        reset_token: data.reset_token,
        reset_token_exp: data.reset_token_exp,
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as Prisma.UserCreateInput,
    });
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { google_id: googleId },
      include: { roles: true },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { roles: true },
    });
    return users.map(this.mapToEntity);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { roles: true },
    });
    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          create: roleIds.map((roleId) => ({
            role: { connect: { id: roleId } },
          })),
        },
      },
      include: { roles: true },
    });
    return this.mapToEntity(user);
  }

  async removeRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: roleIds.map((id) => ({
            user_id_role_id: {
              user_id: userId,
              role_id: id,
            },
          })),
        },
      },
      include: { roles: true },
    });
    return this.mapToEntity(user);
  }
}
