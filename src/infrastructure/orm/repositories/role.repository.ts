import { PrismaClient } from "@prisma/client";
import { Role } from "@/domain/entities/role.entity";
import { IRoleRepository } from "@/domain/repositories/role.repository";

export class PrismaRoleRepository implements IRoleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private convertNullToUndefined<T extends object>(obj: T): Partial<Role> {
    const converted = Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    );
    return converted as Partial<Role>;
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = await this.prisma.role.create({
      data: {
        name: data.name!,
        description: data.description,
      },
    });
    return new Role(this.convertNullToUndefined(role));
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    return role ? new Role(this.convertNullToUndefined(role)) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      include: { permissions: true },
    });
    return role ? new Role(this.convertNullToUndefined(role)) : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      include: { permissions: true },
    });
    return roles.map((role) => new Role(this.convertNullToUndefined(role)));
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: { permissions: true },
    });
    return new Role(this.convertNullToUndefined(role));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: { permissions: true },
    });
    return new Role(this.convertNullToUndefined(role));
  }

  async removePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          deleteMany: {
            permission_id: { in: permissionIds },
          },
        },
      },
      include: { permissions: true },
    });
    return new Role(this.convertNullToUndefined(role));
  }
}
