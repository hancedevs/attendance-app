import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { SalesGuard } from './sales.guard';
import { FeedbackService } from './feedback.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BasicCommonCRUDController } from '@/common/basic-crud.controller';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { BasicCRUDDto } from '@/common/basic-crud.dto';
import { User, UserRole } from '@prisma/client';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { PaginatedRoute } from '@/pagination/pagination.decorator';

@ApiTags('feedback')
@Controller('feedback')
@UseGuards(JwtAuthGuard, SalesGuard)
@UseInterceptors(PaginationInterceptor)
export class FeedbackController
	extends BasicCommonCRUDController<FeedbackService>('Feedback', CreateFeedbackDto, UpdateFeedbackDto) {
	constructor(
		public service: FeedbackService
	) {
		super(service);
	}

	
  create(data: InstanceType<new () => BasicCRUDDto>): any;
  create(data: CreateFeedbackDto, req: { user: User }): Promise<any>;
	@Post()
	@ApiOperation({ summary: `Create one Feedback` })
	@ApiBody({ type: CreateFeedbackDto })
	@ApiCreatedResponse({ type: CreateFeedbackDto })
	create(
		@Body() createCompanyDto: CreateFeedbackDto,
		@Req() req?: { user: User }
	) {
		return this.service.create(req.user.id, createCompanyDto);
	}

	@Get()
	@ApiOperation({ summary: `Get all user feedbacks` })
	@ApiOkResponse({ type: [CreateFeedbackDto] })
	@PaginatedRoute()
	override findAll(
		@Req() req?: { user: User }
	) {
		return req.user.role == UserRole.MARKETING ? this.service.findAll() : this.service.findAllBy(req.user.id);
	}

}
