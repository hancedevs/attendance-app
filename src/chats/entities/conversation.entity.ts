import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Conversation, ConversationType } from "@prisma/client";
import { IsArray, IsDate, IsNumber, IsOptional } from "class-validator";


export class ConversationEntity implements Conversation {

	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsArray()
	members: number[];

	@ApiProperty()
	@IsOptional()
	type: ConversationType;

	@ApiProperty()
	@IsDate()
	createdAt: Date;
}