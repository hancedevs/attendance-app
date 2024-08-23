import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { ScheduleService } from '@/schedule/schedule.service';

@Module({
  providers: [AttendanceService, ScheduleService],
  controllers: [AttendanceController],
  exports: [AttendanceService]
})
export class AttendanceModule {}
