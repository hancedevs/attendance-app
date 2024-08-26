import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Attendance } from '@/attendance/entity/attendance.entity';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { StaffRequest } from '@/requests/entity/staff-request.entity';
import { StaffRequestStatus } from '@prisma/client';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { CreateScheduleDto } from '@/schedule/dto/create-schedule.dto';
import { CreateIPDto } from './dto/create-ip.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(PaginationInterceptor)
export class AdminController {
	constructor(private service: AdminService) {}

	@Get("attendance/:username")
	@ApiOperation({ summary: 'Attendance of a user' })
	@ApiQuery({ name: 'date', description: 'Select a specific date' })
	@ApiQuery({ name: 'startDate', description: 'Select date from' })
	@ApiQuery({ name: 'endDate', description: 'Select date to' })
	@ApiOkResponse({ type: [Attendance] })
	@PaginatedRoute()
	async findUserAttendance(
		@Param('username') username: string,
		@Query('startDate') startDate: undefined | string,
		@Query('endDate') endDate: undefined | string,
		@Query('date') date: undefined | string,
	){
		return await this.service.getAttendance(username, date || startDate, endDate);
	}

	@Get("attachment/:attachmentId")
	@ApiOperation({ summary: 'Get an attachment.' })
	@ApiOkResponse({ example: { id: 1, name: "name", filename: "filename", text: "content" } })
	async findAttendanceAttachment(
		@Param('attachmentId') attachmentId: string,
	){
		return await this.service.getAttachment(+attachmentId);
	}

	@Get('requests')
	@ApiOperation({ summary: 'All requests from all users' })
	@ApiOkResponse({ type: [StaffRequest] })
	@PaginatedRoute()
	async getAllReuests(
		@Query('status') status: undefined | StaffRequestStatus,
		@Query('username') username: undefined | string
	){
		return await this.service.getAllRequests({
			status,
			username
		});
	}

	@Get('requests/:id')
	@ApiOperation({ summary: 'Get a specific request' })
	@ApiOkResponse({ type: StaffRequest })
	async getRequest(
		@Param('id') id: string
	){
		return await this.service.getRequestById(+id);
	}

	@Patch('requests/:id/status')
	@ApiOperation({ summary: 'Change request status' })
	@ApiBody({ type: UpdateRequestStatusDto })
	@ApiOkResponse({ type: StaffRequest })
	async changeStatus(
		@Param('id') id: string,
		@Body() request: UpdateRequestStatusDto
	){
		return await this.service.changeRequestStatus(+id, request.status)
	}

	@Post('schedule/:userId')
	@ApiOperation({ summary: 'Create schedules for user' })
	@ApiBody({ type: [CreateScheduleDto] })
	@ApiCreatedResponse({ type: [CreateScheduleDto] })
	async createStaffSchedule(
		@Param('userId') userId: string,
		@Body() schedule: CreateScheduleDto[]
	){
		return this.service.createSchedule(+userId, schedule);
	}


	@Get('ip-addr')
	@ApiOperation({ summary: 'Get all IP addresses' })
	@ApiOkResponse({ type: StaffRequest })
	async getIP(){
		return await this.service.getAllIPAddress();
	}

	@Post('ip-addr')
	@ApiOperation({ summary: 'Register IP Address' })
	@ApiBody({ type: CreateIPDto })
	@ApiCreatedResponse({ type: CreateIPDto })
	async registerIP(
		@Body() address: CreateIPDto
	){
		return await this.service.addIPAddress(address);
	}


	@Delete('ip-addr/:id')
	@ApiOperation({ summary: 'Delete IP Address' })
	async deleteIP(
		@Param('id') id: string
	){
		return await this.service.rmIPAddress(+id);
	}

	@Get('feedback-analytics')
	@ApiOperation({ summary: 'Fetch feedback with parameters' })
	@ApiQuery({ name: 'user', required: false })
	@ApiQuery({ name: 'industry', required: false })
	@ApiQuery({ name: 'company', required: false })
	@ApiQuery({ name: 'startDate', required: false })
	@ApiQuery({ name: 'endDate', required: false })
	@ApiQuery({ name: 'feedbacks', required: false })
	@ApiOkResponse({ example: {
		totalFeedbacks: 3,
		industryAnalytics: {
			industry: {
        "id": 1,
        "name": "Something",
        "description": "some thing some thing"
      },
			"status": {
        "ACCEPTED": 1,
        "ALMOST_ACCEPTED": 0,
        "UNDECIDED": 1,
        "ALMOST_REJECTED": 0,
        "REJECTED": 1
      },
      "feedbacks": []
		}
	} })
	async fetchAllFeedback(
		@Query('user') userId: number,
		@Query('industry') industryId: number,
		@Query('company') companyId: number,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('feedbacks') includeFeedbacks: string,
	){
		return this.service.fetchFeedbackAnalytics({
			userId: +userId,
			industryId: +industryId,
			companyId: +companyId,
			startDate,
			endDate,
			includeFeedbacks: includeFeedbacks === 'true'
		});
	}

}
