import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()     //This allows using PrismaClient in other file as a single cached instance

export default prisma