import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AttendanceService } from '@/attendance/attendance.service';
import { UsersService } from '@/users/users.service';
import { RequestsService } from '@/requests/requests.service';

@Module({
  providers: [AdminService, AttendanceService, UsersService, RequestsService],
  controllers: [AdminController]
})
export class AdminModule {}
