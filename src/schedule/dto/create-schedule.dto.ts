import { ApiProperty } from "@nestjs/swagger";
import { Day } from "@prisma/client";
import { IsArray, IsDate, IsEnum, IsOptional } from "class-validator";



export class CreateScheduleDto {

	@ApiProperty()
	@IsDate()
	startTime: Date;

	@ApiProperty()
	@IsDate()
	endTime: Date;
	
	@ApiProperty()
	@IsEnum(Day)
	day: Day;

	@ApiProperty()
	@IsOptional()
	uniform?: boolean;

}