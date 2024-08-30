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
import { Company, Feedback, User, UserRole } from '@prisma/client';
import { UsersService } from '@/users/users.service';
import { CreateMessageDto } from '@/chats/dto/create-message.dto';
import { FeedbackService } from '@/feedback/feedback.service';
import { AttendanceService } from '@/attendance/attendance.service';

interface fc extends Feedback {
  company: Company;
}

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
    private attendance: AttendanceService,
    private feedback: FeedbackService,
    private service: EventsService,
    public chats: ChatsService,
    public users: UsersService,
  ){
    super(chats, users);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const verified = await this.service.verifyClient(client);
    if(verified && client.data.user && typeof client.data.user.id == "number"){
      this.service.addOnline(client.data.user.username);
      this.server.emit('user:online', client.data.user.username);
      client.join(client.data.user.id.toString()); 
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

  @SubscribeMessage('feedback:broadcast')
  async broadCastFeedback(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string
  ) {
    const feedback: fc = await this.feedback.findOne(+id);
    const users = await this.users.findAllByRole(UserRole.MARKETING);
    for(const user of users){
      this.sendMessage(client, {
        content: `${feedback.company.name}'s Feedback\nFeedback ID: ${feedback.id}\nFeedback Status: ${feedback.status}${feedback.text ? `\n${feedback.text}` : ''}`,
        recieverId: user.id
      });
    }
  }

  @SubscribeMessage('attendance:absence')
  async broadCastAttendanceAttachment(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string
  ) {
    const attendance = await this.attendance.findOne(+id);
    const users = [].concat(
      await this.attendance.getAdmins()
    ).concat(
      await this.users.findAllByRole(UserRole.MANAGEMENT)
    );
    for(const user of users){
      this.sendMessage(client, {
        content: `${client.data.user.name} is absent today.${attendance.attachment.text ? `\nReasons:\n${attendance.attachment.text}` : ''}`,
        recieverId: user.id,
        attachments: [attendance.attachment.filename]
      });
    }
  }

}