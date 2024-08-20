import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { Observable } from 'rxjs';

export class ChatsGateway {
  constructor(
    public chats: ChatsService
  ){}

  @SubscribeMessage('send-message')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { name: string }
  ) {
    console.log(data);
  }
}
