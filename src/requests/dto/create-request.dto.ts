import { ApiProperty } from "@nestjs/swagger";
import { StaffRequest } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	content: string;
}