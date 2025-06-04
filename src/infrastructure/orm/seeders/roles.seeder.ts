import { PrismaClient } from "@prisma/client";
import logger from "@/infrastructure/logger";

const prisma = new PrismaClient();

const defaultRoles = [
  {
    name: "SUPER_ADMIN",
    description: "Super administrator with full system access",
    permissions: [
      "CREATE",
      "READ",
      "UPDATE",
      "DELETE",
      "MANAGE",
      "APPROVE",
      "GRANT_ACCESS",
      "REVOKE_ACCESS",
      "CONFIGURE",
      "AUDIT",
    ],
  },
  {
    name: "ADMIN",
    description: "Administrator with elevated access",
    permissions: [
      "CREATE",
      "READ",
      "UPDATE",
      "DELETE",
      "MANAGE",
      "APPROVE",
      "GRANT_ACCESS",
      "REVOKE_ACCESS",
    ],
  },
  {
    name: "MANAGER",
    description: "Manager with resource management capabilities",
    permissions: ["CREATE", "READ", "UPDATE", "MANAGE", "APPROVE"],
  },
  {
    name: "USER",
    description: "Regular user with basic access",
    permissions: ["READ"],
  },
  {
    name: "AUDITOR",
    description: "System auditor with read and audit capabilities",
    permissions: ["READ", "AUDIT"],
  },
];

export async function seedRoles() {
  try {
    for (const roleData of defaultRoles) {
      const { permissions, ...roleInfo } = roleData;

      const role = await prisma.role.upsert({
        where: { name: roleInfo.name },
        update: {},
        create: roleInfo,
      });

      // Get all permissions for this role
      const rolePermissions = await prisma.permission.findMany({
        where: {
          name: {
            in: permissions,
          },
        },
      });

      // Create role-permission relationships
      for (const permission of rolePermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: role.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: role.id,
            permission_id: permission.id,
          },
        });
      }
    }
    logger.info("Roles seeding completed");
  } catch (error) {
    logger.error(`Error seeding roles: ${error}`);
    throw new Error(`Error seeding roles: ${error}`);
  }
}
