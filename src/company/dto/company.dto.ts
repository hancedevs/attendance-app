import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";




export class CreateCompanyDto {
  @ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
  phoneNo: string;

  @ApiProperty()
	@IsString()
  address: string;

  @ApiProperty()
	@IsString()
  email: string;

  @ApiProperty()
	@IsNumber()
  industryId: number;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
