import { ApiProperty } from "@nestjs/swagger";
import { Message } from "@prisma/client";
import { IsNotEmpty, IsNumber } from "class-validator";



export class MessageEntity implements Message {
	
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	@IsNumber()
	conversationId: number;

	@ApiProperty()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	@IsNumber()
	userId: number;

}