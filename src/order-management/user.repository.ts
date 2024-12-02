import { User } from "@prisma/client";
import prisma from "../util/lib/client";

export default class UserRepository {
    
    async findByUserId(userId: number) {
        const user = prisma.user.findUnique({
            where: { id: userId }
          });
        return user;
    }
}