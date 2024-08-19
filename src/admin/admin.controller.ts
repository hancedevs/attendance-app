import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Param, Patch, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Attendance } from '@/attendance/entity/attendance.entity';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { StaffRequest } from '@/requests/entity/staff-request.entity';
import { StaffRequestStatus } from '@prisma/client';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(PaginationInterceptor)
export class AdminController {
	constructor(private service: AdminService) {}

	@Get("attendance/:username")
	@ApiOperation({ summary: 'Attendance of a user' })
	@ApiOkResponse({ type: [Attendance] })
	@PaginatedRoute()
	async findUserAttendance(
		@Param('username') username: string
	){
		return await this.service.getAttendance(username)
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

}
