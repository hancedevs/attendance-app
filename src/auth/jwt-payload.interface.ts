import { UserRole } from "@prisma/client";

export interface JwtPayloadInterface {
  id: number;
  role: UserRole;
}
