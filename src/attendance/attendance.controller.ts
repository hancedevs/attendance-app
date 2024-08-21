import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Attendance } from './entity/attendance.entity';
import { Attachment, AttendType, User } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { UploadDestination } from '@/const/upload-destination';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { DailySummary } from './entity/daily-summary.entity';
import { PeriodSummary } from './entity/period-summary.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaginationInterceptor)
export class AttendanceController {
	constructor(private service: AttendanceService){}

	@Get()
  @ApiOperation({ summary: 'All attendances for current user' })
	@ApiQuery({ name: 'date', description: 'Select a specific date' })
	@ApiQuery({ name: 'startDate', description: 'Select date from' })
	@ApiQuery({ name: 'endDate', description: 'Select date to' })
  @ApiOkResponse({ type: [DailySummary] })
	@PaginatedRoute()
  async getAll(
		@Request() req: { user: User },
		@Query('startDate') startDate: undefined | string,
		@Query('endDate') endDate: undefined | string,
		@Query('date') date: undefined | string,
	) {
		return await this.service.getAll(req.user.id, date || startDate, endDate);
  }

	@Get('state')
  @ApiOperation({ summary: 'Current user state' })
  @ApiOkResponse({  })
  async getState(@Request() req: { user: User }) {
		return {
			status: await this.service.getCurrentState(req.user.id)
		};
  }

	@Get('today')
  @ApiOperation({ summary: 'Hours attended today' })
  @ApiOkResponse({ type: DailySummary })
  async getDailySummary(
		@Request() req: { user: User }
	) {
		const today = new Date().toDateString();
		return (await this.service.getAll(req.user.id, today))[0] || {
			date: today,
			time: {
				in: 0,
				out: 0
			},
			attandances: [],
			hours: [],
			totalTime: 0,
			totalMinutes: '00:00',
			totalHours: '00:00',
			totalHoursNumber: 0
		};
  }
	
	@Get('weekly')
  @ApiOperation({ summary: 'Weekly attendance' })
	@ApiQuery({ name: 'summaries', type: Boolean, description: 'Wether to send everday record or not' })
  @ApiOkResponse({ type: PeriodSummary })
  async getWeeklySummary(
		@Request() req: { user: User },
		@Query('summaries') summaries: string
	) {
		return await this.service.getWeeklyAttendance(req.user.id, summaries === 'true');
  }
	
	@Get('monthly')
  @ApiOperation({ summary: 'Monthly attendance' })
	@ApiQuery({ name: 'summaries', type: Boolean, description: 'Wether to send everday record or not' })
  @ApiOkResponse({ type: PeriodSummary })
  async getMonthlySummary(
		@Request() req: { user: User },
		@Query('summaries') summaries: string
	) {
		return await this.service.getMonthlyAttendance(req.user.id, summaries === 'true');
  }

	@Get('attachment/:attachmentId')
	@ApiOperation({ summary: 'Get attachment information' })
	@ApiParam({ name: 'attachmentId' })
	@ApiCreatedResponse({ example: { id: 1, name: "name", filename: "filename", text: "content" } })
	async getAttachment(
		@Request() req: { user: User },
		@Param('attachmentId') attachmentId: string
	) {
		return await this.service.getAttachment(
			+attachmentId,
			req.user.id
		);
	}

	@Post('attachment')
	@ApiOperation({ summary: 'Attach document as proof for absence' })
	@ApiCreatedResponse({ type: Attendance })
	async uploadAttachment(
		@Body() attachment: CreateAttachmentDto,
		@Request() req: { user: User }
	) {
		return await this.service.attachment(
			attachment,
			attachment.filename,
			req.user.id
		);
	}

	@Post()
  @ApiOperation({ summary: 'Change the current status' })
  @ApiQuery({ name: 'status', enum: AttendType, description: 'The current status' })
	@ApiOkResponse({ type: Attendance })
  async create(@Request() req: { user: User }, @Query('type') status: AttendType) {
		return await this.service.create(req.user.id, status);
  }

}
