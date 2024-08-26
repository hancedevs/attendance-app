import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConversationType, Message } from '@prisma/client';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatsService {
	constructor(
		private prisma: PrismaService
	) {}

	async findPrivateConversation(senderId: number, recieverId: number){
		return await this.prisma.conversation.findFirst({
			where: {
				members: {
					has: senderId,
				},
				AND: {
					members: {
						has: recieverId
					}
				},
				type: ConversationType.PRIVATE
			}
		});
	}

	async findGroupConversation(groupId: number){
		return await this.prisma.group.findUnique({ where: { id: groupId } });
	}

	async findUserInGroup(groupId: number, userId: number){
		return await this.prisma.group.findUnique({
			where: {
				id: groupId,
				conversation: {
					members: {
						has: userId
					}
				}
			},
			include: {
				conversation: true
			}
		})
	}

	async createPrivateConversation(senderId: number, recieverId: number){
		return await this.prisma.conversation.create({
			data: {
				type: ConversationType.PRIVATE,
				members: [senderId, recieverId]
			}
		});
	}

	async createMessage(conversationId: number, userId: number, message: CreateMessageDto){
		return await this.prisma.message.create({
			data: {
				conversationId,
				content: message.content,
				userId
			},
			include: {
				user: {
					select: {
						name: true,
						id: true,
						username: true,
						email: true
					}
				},
				attachments: true
			}
		});
	}

	async getMessageById(id: number){
		return this.prisma.message.findUnique({ where: { id }, include: { attachments: true } });
	}

	async createMessageAttachment(messageId: number, filename: string){
		return await this.prisma.messageAttachment.create({
			data: {
				messageId,
				filename
			}
		});
	}

	async getAllMessagesFromConversation(conversationId: number, userId: number){
		return await this.prisma.message.findMany({
			where: {
				conversationId,
				conversation: {
					members: {
						has: userId
					}
				}
			},
			include: {
				attachments: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	async getAllConversationsFor(userId: number){
		return await this.prisma.conversation.findMany({
			where: {
				members: {
					has: userId
				}
			},
			include: {
				Message: {
					take: 1,
					include: {
						attachments: {
							take: 2,
							select: {
								filename: true
							}
						}
					},
					orderBy: {
						createdAt: 'desc'
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}
}
