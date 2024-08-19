import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber } from "class-validator";
import { CreateAttendanceDto } from "../dto/create-attendance.dto";

export class Attendance extends CreateAttendanceDto {
	@ApiProperty()
	@IsDate()
	date: number;

	@ApiProperty()
	@IsNumber()
	id: number;
}