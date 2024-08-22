import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { BasicCommonCRUDController } from '@/common/basic-crud.controller';
import { Controller, UseGuards } from '@nestjs/common';
import { CreateIndustryDto, UpdateIndustryDto } from './dto/industry.dto';
import { IndustryService } from './industry.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('industry')
@Controller('industry')
@UseGuards(JwtAuthGuard)
export class IndustryController
	extends BasicCommonCRUDController<IndustryService>('Industry', CreateIndustryDto, UpdateIndustryDto) {
		constructor(public service: IndustryService){
			super(service);
		}
	}
