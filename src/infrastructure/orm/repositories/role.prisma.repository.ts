import { PrismaClient } from '@prisma/client';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { Role } from '@/domain/entities/role.entity';

export default class RoleRepository implements IRoleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapToEntity(prismaRole: any): Role {
    return new Role({
      ...prismaRole,
      description: prismaRole.description ?? undefined,
    });
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = await this.prisma.role.create({
      data: {
        name: data.name!,
        description: data.description,
      },
    });
    return this.mapToEntity(role);
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    return role ? this.mapToEntity(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findFirst({
      where: { name },
      include: { permissions: true },
    });
    return role ? this.mapToEntity(role) : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      include: { permissions: true },
    });
    return roles.map(this.mapToEntity);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id },
      data,
      include: { permissions: true },
    });
    return this.mapToEntity(role);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({
            role_id_permission_id: {
              role_id: roleId,
              permission_id: id,
            },
          })),
        },
      },
      include: { permissions: true },
    });
    return this.mapToEntity(role);
  }

  async removePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: permissionIds.map((id) => ({
            role_id_permission_id: {
              role_id: roleId,
              permission_id: id,
            },
          })),
        },
      },
      include: { permissions: true },
    });
    return this.mapToEntity(role);
  }
}
