import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { BasicCommonCRUDService } from '@/common/basic-crud.service';

@Injectable()
export class CompanyService
	extends BasicCommonCRUDService<CreateCompanyDto, UpdateCompanyDto>('company') {
  constructor(public prisma: PrismaService) {
		super(prisma);
	}
	includes = { industry: true  };
}
