import { UploadDestination } from '@/const/upload-destination';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@ApiTags('file')
@Controller('file')
export class FileController {

	@Get(':filename')
	@ApiOperation({ summary: 'Get an uploaded file by it\'s name' })
	@ApiParam({ name: 'filename' })
	@ApiOkResponse({ description: 'File content' })
	async getAttachment(
		@Param('filename') filename: string,
		@Res() res: Response
	){
		const filePath = join(UploadDestination(), filename);

		if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

		return res.sendFile(filePath);
	}
}
