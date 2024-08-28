
import { ApiProperty } from '@nestjs/swagger';
import { CreateRequestDto } from '../dto/create-request.dto';
import { IsEnum, IsNumber } from 'class-validator';
import { StaffRequestStatus } from '@prisma/client';

export class StaffRequest extends CreateRequestDto {
	@ApiProperty()
	@IsNumber()
	userId: number;

	@ApiProperty({ enum: StaffRequestStatus })
	@IsEnum(StaffRequestStatus)
	status: StaffRequestStatus;
}