import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
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

	@Post('attachment')
	@ApiOperation({ summary: 'Attach document as proof for absence' })
	@ApiCreatedResponse({ type: Attendance })
	@UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: UploadDestination(),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit the file size to 5MB
    },
  }))
	async uploadAttachment(
		@Body() attachment: Partial<Attachment>,
		@UploadedFile() file: Express.Multer.File,
		@Request() req: { user: User }
	) {
		return await this.service.attachment(
			attachment,
			basename(file.path),
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
