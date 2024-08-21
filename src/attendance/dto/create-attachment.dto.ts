import { ApiProperty } from "@nestjs/swagger";
import { Attendance, AttendType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateAttachmentDto {

	@ApiProperty()
	@IsString()
	@IsOptional()
	text: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	filename?: string;

}