import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { StaffRequestStatus, StaffRequest as StaffRequestType, User } from '@prisma/client';
import { StaffRequest } from './entity/staff-request.entity';
import { PaginatedRoute } from '@/pagination/pagination.decorator';
import { PaginationInterceptor } from '@/pagination/pagination.interceptor';



@ApiTags('requests')
@Controller('requests')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaginationInterceptor)
export class RequestsController {

	constructor(private service: RequestsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a request to management' })
	@ApiBody({ type: CreateRequestDto })
	@ApiOkResponse({ type: StaffRequest })
	async createRequest(
		@Body() request: CreateRequestDto,
		@Request() req: { user: User },
	){
		let attachmentId = undefined;
		if(request.filename){
			attachmentId = (await this.service.attachment(
				request.filename,
				{
					name: 'File For Request'
				}
			)).id;
		}
		return this.service.create({
			...request,
			userId: req.user.id,
			attachmentId
		});
	}

	@Get()
	@ApiOperation({ summary: 'Get all requests' })
	@ApiOkResponse({ type: [StaffRequest] })
	@PaginatedRoute()
	async getAll(
		@Request() req: { user: User },
		@Query('status') status: undefined | string
	){
		return await this.service.getAllFrom(req.user.id, status as (undefined | StaffRequestStatus), true);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get one requests' })
	@ApiOkResponse({ type: StaffRequest })
	async getOne(
		@Param('id') id: number
	){
		return await this.service.getOne(+id);
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

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a request' })
	@ApiOkResponse({ type: StaffRequest })
	async delete(
		@Param('id') id: string,
		@Request() req: { user: User },
	){
		return await this.service.deleteWhere(+id, req.user.id);
	}

}
