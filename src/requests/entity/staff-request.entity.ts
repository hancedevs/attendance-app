
import { ApiProperty } from '@nestjs/swagger';
import { CreateRequestDto } from '../dto/create-request.dto';
import { IsNumber } from 'class-validator';

export class StaffRequest extends CreateRequestDto {
	@ApiProperty()
	@IsNumber()
	userId: number;
}