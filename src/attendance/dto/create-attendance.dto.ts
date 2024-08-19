import { ApiProperty } from "@nestjs/swagger";
import { Attendance, AttendType } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";


export class CreateAttendanceDto implements Partial<Attendance> {

	@ApiProperty()
	@IsNumber()
	userId: number;

	@ApiProperty({ enum: AttendType })
	@IsEnum(AttendType)
	status: AttendType;

}