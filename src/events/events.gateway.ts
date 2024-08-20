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
import { verify } from 'jsonwebtoken';
import { JwtPayloadInterface } from '@/auth/jwt-payload.interface';
import { EventsService } from './events.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
// @UseGuards(WSJwtAuthGuard)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtStrategy,
    private service: EventsService
  ){}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { token } = client.handshake.query;
    
    if(token){
      verify(token as string, process.env.JWT_SECRET, async (err, payload: JwtPayloadInterface) => {
        if(err){
          return client.disconnect();
        }
        let user = await this.jwtService.validate(payload);
        if(!user){
          return client.disconnect();
        }
        client.data.user = user;
      });
    } else {
      client.disconnect();
    }
  }
  
  @SubscribeMessage('whoami')
  findAll(
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    return client.data.user;
  }

}