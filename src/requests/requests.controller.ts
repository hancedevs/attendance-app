import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { StaffRequestStatus, StaffRequest as StaffRequestType, User } from '@prisma/client';
import { StaffRequest } from './entity/staff-request.entity';
import { basename, extname } from 'path';
import { UploadDestination } from '@/const/upload-destination';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
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
	async createRequest(
		@Body() request: CreateRequestDto,
		@Request() req: { user: User },
		@UploadedFile() file: Express.Multer.File,
	){
		let attachmentId = undefined;
		if(file){
			attachmentId = (await this.service.attachment(
				basename(file.path),
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
