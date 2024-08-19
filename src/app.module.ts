import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { RequestsModule } from './requests/requests.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, UsersModule, AttendanceModule, PrismaModule, FileModule, RequestsModule, AdminModule],
  providers: [JwtStrategy, FileService],
  controllers: [FileController]
})
export class AppModule {}
