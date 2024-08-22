import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SalesGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		return user.role == UserRole.SALES;
  }
}
