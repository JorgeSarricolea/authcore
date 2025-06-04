import { PrismaClient } from "@prisma/client";
import { Permission } from "@/domain/entities/permission.entity";
import { IPermissionRepository } from "@/domain/repositories/permission.repository";

export class PrismaPermissionRepository implements IPermissionRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapToEntity(prismaPermission: any): Permission {
    return new Permission({
      ...prismaPermission,
      description: prismaPermission.description ?? undefined,
    });
  }

  async create(data: Partial<Permission>): Promise<Permission> {
    const permission = await this.prisma.permission.create({
      data: {
        name: data.name!,
        description: data.description,
      },
    });
    return this.mapToEntity(permission);
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    return permission ? this.mapToEntity(permission) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
    });
    return permission ? this.mapToEntity(permission) : null;
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany();
    return permissions.map(this.mapToEntity);
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    const permission = await this.prisma.permission.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return this.mapToEntity(permission);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }
}
