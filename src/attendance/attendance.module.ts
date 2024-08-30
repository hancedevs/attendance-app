import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { ScheduleService } from '@/schedule/schedule.service';
import { EventsGateway } from '@/events/events.gateway';

@Module({
  imports: [],
  providers: [AttendanceService, ScheduleService],
  controllers: [AttendanceController],
  exports: [AttendanceService]
})
export class AttendanceModule {}
