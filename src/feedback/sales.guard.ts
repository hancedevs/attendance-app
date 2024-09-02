import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

interface UserWithAdminTag extends User {
  isAdmin: boolean;
}

@Injectable()
export class SalesGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const req = context.switchToHttp().getRequest();
		const user = req.user as UserWithAdminTag;

		return user.role == UserRole.SALES || user.role == UserRole.MARKETING || user.isAdmin;
  }
}
