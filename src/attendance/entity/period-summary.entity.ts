import { ApiProperty } from "@nestjs/swagger";
import { isArray, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { DailySummary } from "./daily-summary.entity";



export class PeriodSummary {

	@ApiProperty({ type: [DailySummary] })
	@IsArray()
	dailySummaries: DailySummary[];

	
	@ApiProperty()
	@IsNumber()
	totalDays: number;

	@ApiProperty()
	@IsNumber()
	totalTime: number;
	
	@ApiProperty()
	@IsString()
	totalMinutes: string;

	@ApiProperty()
	@IsString()
	totalHours: string;

}