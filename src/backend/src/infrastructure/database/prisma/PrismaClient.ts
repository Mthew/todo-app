// Singleton to ensure only one instance of Prisma Client is used.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
