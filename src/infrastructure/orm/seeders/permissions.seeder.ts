import { PrismaClient } from "@prisma/client";
import logger from "@/infrastructure/logger";

const prisma = new PrismaClient();

const defaultPermissions = [
  // Generic CRUD Operations
  {
    name: "CREATE",
    description: "Can create new resources",
  },
  {
    name: "READ",
    description: "Can view resources",
  },
  {
    name: "UPDATE",
    description: "Can update resources",
  },
  {
    name: "DELETE",
    description: "Can delete resources",
  },
  // Administrative Operations
  {
    name: "MANAGE",
    description: "Can manage resources and their configurations",
  },
  {
    name: "APPROVE",
    description: "Can approve or reject resources",
  },
  // Access Control
  {
    name: "GRANT_ACCESS",
    description: "Can grant access to resources",
  },
  {
    name: "REVOKE_ACCESS",
    description: "Can revoke access from resources",
  },
  // System Operations
  {
    name: "CONFIGURE",
    description: "Can configure system settings",
  },
  {
    name: "AUDIT",
    description: "Can audit system activities",
  },
];

export async function seedPermissions() {
  try {
    for (const permission of defaultPermissions) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: permission,
      });
    }
    logger.info("Permissions seeding completed");
  } catch (error) {
    logger.error(`Error seeding permissions: ${error}`);
    throw new Error(`Error seeding permissions: ${error}`);
  }
}
