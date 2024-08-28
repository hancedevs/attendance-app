import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { ScheduleService } from '@/schedule/schedule.service';
import { EventsGateway } from '@/events/events.gateway';
import { EventsModule } from '@/events/events.module';
import { ChatsModule } from '@/chats/chats.module';

@Module({
  imports: [EventsModule, ChatsModule],
  providers: [AttendanceService, ScheduleService],
  controllers: [AttendanceController],
  exports: [AttendanceService]
})
export class AttendanceModule {}
