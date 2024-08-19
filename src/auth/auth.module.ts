import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '@/users/users.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '@/prisma/prisma.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '894#pbun08q7%34p9h8r*q34',
      signOptions: { expiresIn: '12d' },
    }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
