import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles.seeder";
import { seedPermissions } from "./permissions.seeder";

const prisma = new PrismaClient();

async function main() {
  try {
    // First seed permissions, then roles (which depend on permissions)
    await seedPermissions();
    await seedRoles();
  } catch (error) {
    throw new Error(`Error running seeders: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  throw new Error(`Error in main seeder: ${error}`);
});
