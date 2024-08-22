import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CompanyService } from './company.service';
import { BasicCommonCRUDController } from '@/common/basic-crud.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('company')
@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController extends BasicCommonCRUDController<CompanyService>('Company', CreateCompanyDto, UpdateCompanyDto) {
	constructor(public readonly service: CompanyService) {
		super(service);
	}
}