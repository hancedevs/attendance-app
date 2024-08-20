import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { EventsService } from './events.service';

@Module({
  providers: [EventsGateway, JwtStrategy, EventsService]
})
export class EventsModule {}
