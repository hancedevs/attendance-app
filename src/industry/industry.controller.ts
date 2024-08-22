import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { BasicCommonCRUDController } from '@/common/basic-crud.controller';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateIndustryDto, UpdateIndustryDto } from './dto/industry.dto';
import { IndustryService } from './industry.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';

@ApiTags('industry')
@Controller('industry')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaginationInterceptor)
export class IndustryController
	extends BasicCommonCRUDController<IndustryService>('Industry', CreateIndustryDto, UpdateIndustryDto) {
		constructor(public service: IndustryService){
			super(service);
		}
	}
