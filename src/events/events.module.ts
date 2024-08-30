import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { EventsService } from './events.service';
import { ChatsGateway } from '@/chats/chats.gateway';
import { ChatsService } from '@/chats/chats.service';
import { ChatsModule } from '@/chats/chats.module';
import { EventsController } from './events.controller';
import { UsersService } from '@/users/users.service';
import { FeedbackModule } from '@/feedback/feedback.module';
import { AttendanceModule } from '@/attendance/attendance.module';

@Module({
  imports: [ChatsModule, FeedbackModule, AttendanceModule],
  providers: [EventsGateway, JwtStrategy, EventsService, UsersService, ChatsGateway, ChatsService],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}
