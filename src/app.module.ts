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
import { EventsModule } from './events/events.module';
import { ChatsModule } from './chats/chats.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CompanyModule } from './company/company.module';
import { IndustryModule } from './industry/industry.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [AuthModule, UsersModule, AttendanceModule, PrismaModule, FileModule, RequestsModule, AdminModule, EventsModule, ChatsModule, FeedbackModule, CompanyModule, IndustryModule, ScheduleModule],
  providers: [JwtStrategy, FileService, EmailService],
  controllers: [FileController]
})
export class AppModule {}
