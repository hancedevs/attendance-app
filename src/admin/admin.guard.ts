import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		const isAdmin = await this.prisma.admin.findFirst({ where: { userId: user.id } });

		if(isAdmin){
			return true;
		}

		return false;
  }
}
