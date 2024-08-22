import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '@/users/users.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
import { ApiWebSocketEvent } from '@/doc/api-sockets.decorator';

export class ChatsGateway {
  constructor(
    public chats: ChatsService,
    public users: UsersService
  ){}

  server: Server;

  @ApiWebSocketEvent('send-message:private', 'Hello')
  @SubscribeMessage('send-message:private')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto
  ) {
    const sender: User = client.data.user;
    const reciever = data.reciever ? await this.users.findOneByUsername(data.reciever) : await this.users.findOne(data.recieverId);

    if(!sender){
      throw new UnauthorizedException();
    }

    if(!reciever){
      throw new NotFoundException('Not found');
    }

    let conversation = await this.chats.findPrivateConversation(
      sender.id,
      reciever.id
    );

    if(!conversation){
      conversation = await this.chats.createPrivateConversation(
        sender.id,
        reciever.id
      );
    }

    // console.log(sender.id, 'to', reciever.id);

    const message = await this.chats.createMessage(
      conversation.id,
      sender.id,
      data
    );
    
    client.emit('send-message', message);
    this.server.to(reciever.id.toString()).emit('send-message', message);
  }

  @SubscribeMessage('send-message:group')
  async sendMessageGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto
  ) {
    const sender: User = client.data.user;
    const group = await this.chats.findUserInGroup(data.groupId, sender.id);

    if(!sender){
      throw new UnauthorizedException();
    }

    if(!group){
      throw new NotFoundException('Not found');
    }

    let conversation = group.conversation;

    const message = await this.chats.createMessage(
      conversation.id,
      sender.id,
      data
    );
    
    client.emit('send-message', message);
    conversation.members.forEach(memberId => {
      this.server.to(memberId.toString()).emit('send-message', message);
    });
  }
}
