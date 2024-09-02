import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from './entities/message.entity';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { User } from '@prisma/client';
import { ConversationEntity } from './entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '@/users/users.service';

@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaginationInterceptor)
export class ChatsController {
	constructor(private service: ChatsService, private users: UsersService){}

	@Get(':conversationId')
	@ApiOperation({ summary: 'Get all messages from a conversation' })
	@ApiOkResponse({ type: [MessageEntity] })
	@PaginatedRoute()
	async getFromConversation(
		@Param('conversationId') conversationId: string,
		@Request() req: { user: User },
	){
		return this.service.getAllMessagesFromConversation(+conversationId, req.user.id);
	}

	@Post('create/:userId')
	@ApiOperation({ summary: 'Create a conversation with a user' })
	@ApiOkResponse({ type: ConversationEntity })
	async createConversation(
		@Param('userId') userId: string,
		@Request() req: { user: User },
	){
		const hasAConversation = await this.service.findPrivateConversation(req.user.id, +userId)
		return hasAConversation || await this.service.createPrivateConversation(req.user.id, +userId);
	}

	@Post('send/:receiverId')
	@ApiOperation({ summary: 'Send message with HTTP' })
	@ApiOkResponse({ type: ConversationEntity })
	async sendMessgae(
		@Param('receiverId') receiverId: string,
		@Request() req: { user: User },
		@Body() messgae: CreateMessageDto
	){
    const isID = !isNaN(+receiverId);
		const reciever = isID ? await this.users.findOne(+receiverId) : await this.users.findOneByUsername(receiverId);
		return await this.service.sendPrivateMessage(req.user, reciever, messgae);
	}
	
	@Get()
	@ApiOperation({ summary: 'Get all conversations for current user' })
	@ApiOkResponse({ type: [ConversationEntity] })
	@PaginatedRoute()
	async getAllConversation(
		@Request() req: { user: User },
	){
		return this.service.getAllConversationsFor(req.user.id);
	}

}
