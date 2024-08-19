import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class DailySummary {

	@ApiProperty()
	@IsNumber()
	totalTime: number;

	@ApiProperty()
	@IsNumber()
	totalHoursNumber: number;

	@ApiProperty()
	@IsString()
	totalMinutes: string;

	@ApiProperty()
	@IsString()
	totalHours: string;

	@ApiProperty({ example: [ ["9:25:05 AM", "9:28:06 AM"] ] })
	@IsArray()
	hours: string[][];

	@ApiProperty({ example: [1, 2, 3, 4] })
	@IsArray()
	attandances: number[];

	@ApiProperty({ example: "Mon Aug 19 2024" })
	@IsString()
	date: string;

	@ApiProperty({
		example: {
			in: 1724058582845,
			out: 1724058593354
		}
	})
	@IsNotEmpty()
	time: {
		in: number,
		out: number
	};

}