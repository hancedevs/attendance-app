import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateIPDto {

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsString()
	name: string;

}