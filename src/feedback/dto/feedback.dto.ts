import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { FeedbackStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateFeedbackDto {
	@ApiProperty()
	@IsString()
  text: string;

  @ApiProperty()
	@IsOptional()
	@IsNumber()
	attachmentId?: number;

  @ApiProperty()
	@IsOptional()
	@IsNumber()
	userId?: number;
  
  @ApiProperty()
	@IsNumber()
	companyId: number;
  
	@ApiProperty({ enum: FeedbackStatus })
	@IsEnum(FeedbackStatus)
	status: FeedbackStatus;
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}