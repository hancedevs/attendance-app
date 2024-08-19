import { ApiProperty } from "@nestjs/swagger";
import { StaffRequestStatus } from "@prisma/client";
import { IsEnum } from "class-validator";


export class UpdateRequestStatusDto {

	@ApiProperty({ enum: StaffRequestStatus })
	@IsEnum(StaffRequestStatus)
	status: StaffRequestStatus;

}