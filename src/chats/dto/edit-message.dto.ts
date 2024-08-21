import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EditMessageDto {
	@ApiProperty()
	@IsNumber()
	id: string;

	@ApiProperty()
	@IsNotEmpty()
	content: string;
}