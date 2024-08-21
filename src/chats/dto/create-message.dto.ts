import { PartialType } from "@nestjs/mapped-types";
import { MessageEntity } from "../entities/message.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";


export class CreateMessageDto extends PartialType(MessageEntity) {
	@ApiProperty()
	@IsOptional()
	reciever?: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	recieverId?: number;


	@ApiProperty()
	@IsOptional()
	@IsNumber()
	conversationId?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	groupId?: number;
}