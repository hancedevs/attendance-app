import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { EventsService } from './events.service';
import { ChatsGateway } from '@/chats/chats.gateway';
import { ChatsService } from '@/chats/chats.service';
import { ChatsModule } from '@/chats/chats.module';
import { EventsController } from './events.controller';

@Module({
  imports: [ChatsModule],
  providers: [EventsGateway, JwtStrategy, EventsService, ChatsGateway, ChatsService],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}
