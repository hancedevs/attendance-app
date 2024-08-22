import { ApiProperty } from "@nestjs/swagger";
import { Day, Schedule } from "@prisma/client";
import { IsDate, IsEnum, IsNumber } from "class-validator";



export class ScheduleEntity implements Schedule {
	
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsEnum(Day)
	day: Day;

	@ApiProperty()
	@IsDate()
	startTime: Date;

	@ApiProperty()
	@IsDate()
	endTime: Date;

	@ApiProperty()
	@IsNumber()
	userId: number;
}