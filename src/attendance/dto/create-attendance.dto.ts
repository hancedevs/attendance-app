import { ApiProperty } from "@nestjs/swagger";
import { Attendance, AttendType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateAttendanceDto implements Partial<Attendance> {

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	userId: number;

	@ApiProperty({ enum: AttendType })
	@IsEnum(AttendType)
	status: AttendType;

	@ApiProperty()
	@IsOptional()
	@IsString()
	filename?: string;

}