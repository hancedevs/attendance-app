import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class CreateIPDto {

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsString()
	name: string;

}

export class EditIPDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	enabled: boolean;
}