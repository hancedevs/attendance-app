import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConversationType, Message, User } from '@prisma/client';
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

	async deletePrivateConversation(id: number){
		await this.deleteMessagesFromConversation(id);
		return await this.prisma.conversation.delete({ where: { id } });
	}

	async deleteMessagesFromConversation(id: number){
		const messages = await this.getAllMessagesFromConversation(id);
		for(let message of messages){
			await this.prisma.messageAttachment.deleteMany({ where: { messageId: message.id } });
		}
		return await this.prisma.message.deleteMany({
			where: {
				conversationId: id
			}
		})
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

	async getAllMessagesFromConversation(conversationId: number, userId?: number){
		return await this.prisma.message.findMany({
			where: {
				conversationId,
				conversation: userId ? {
					members: {
						has: userId
					}
				} : {}
			},
			include: {
				attachments: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	async getAllConversationsFor(userId: number, include = true){
		return await this.prisma.conversation.findMany({
			where: {
				members: {
					has: userId
				}
			},
			include: include ? {
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
			} : {},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	async sendPrivateMessage(sender: User, reciever: User, data: CreateMessageDto){
    let conversation = await this.findPrivateConversation(
      sender.id,
      reciever.id
    );

    if(!conversation){
      conversation = await this.createPrivateConversation(
        sender.id,
        reciever.id
      );
    }

    // console.log(sender.id, 'to', reciever.id);

    let message: Message = await this.createMessage(
      conversation.id,
      sender.id,
      data
    );

    if(data.attachments){
      for(let filename of data.attachments){
        await this.createMessageAttachment(message.id, filename);
      }
      message = await this.getMessageById(message.id);
    }

		return message;
	}
}
