import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { WSJwtAuthGuard } from './ws-jwt.guard';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { EventsService } from './events.service';
import { ChatsGateway } from '@/chats/chats.gateway';
import { ChatsService } from '@/chats/chats.service';
import { User } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
// @UseGuards(WSJwtAuthGuard)
export class EventsGateway extends ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private service: EventsService,
    public chats: ChatsService,
  ){
    super(chats);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const verified = await this.service.verifyClient(client);
    if(verified){
      this.service.addOnline(client.data.user.username);
      this.server.emit('user:online', client.data.user.username);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket){
    this.server.emit('user:offline', client.data.user.username);
    this.service.removeOnline(client.data.user.username);
  }
  
  @SubscribeMessage('whoami')
  whoAmI(
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<Partial<User>>> {
    return client.data.user;
  }

}