import { BasicCommonCRUDService } from '@/common/basic-crud.service';
import { Injectable } from '@nestjs/common';
import { CreateIndustryDto, UpdateIndustryDto } from './dto/industry.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class IndustryService extends BasicCommonCRUDService<CreateIndustryDto, UpdateIndustryDto>('industry') {
	constructor(public prisma: PrismaService) {
		super(prisma);
	}
}
