import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SalesGuard } from './sales.guard';
import { FeedbackService } from './feedback.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BasicCommonCRUDController } from '@/common/basic-crud.controller';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { BasicCRUDDto } from '@/common/basic-crud.dto';
import { User } from '@prisma/client';

@ApiTags('feedback')
@Controller('feedback')
@UseGuards(JwtAuthGuard, )
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
}
