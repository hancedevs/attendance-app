import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
