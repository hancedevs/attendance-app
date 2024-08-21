import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from './entities/message.entity';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { User } from '@prisma/client';
import { ConversationEntity } from './entities/conversation.entity';

@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaginationInterceptor)
export class ChatsController {
	constructor(private service: ChatsService){}

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
