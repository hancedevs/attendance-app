import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { UsersService } from '@/users/users.service';

@Module({
  providers: [ChatsService, ChatsGateway, UsersService],
  controllers: [ChatsController],
  exports: [ChatsService, ChatsGateway]
})
export class ChatsModule {}
