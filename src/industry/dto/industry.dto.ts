import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

// industry.dto.ts
export class CreateIndustryDto {

	@ApiProperty()
	@IsString()
  name: string;
	
	@ApiProperty()
	@IsString()
  description: string;
}

export class UpdateIndustryDto extends PartialType(CreateIndustryDto) {}