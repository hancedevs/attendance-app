import { UploadDestination } from '@/const/upload-destination';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync, statfsSync, statSync } from 'fs';
import { extname, join } from 'path';
import { lookup, types } from 'mime-types';

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

	@Get('stats/:filename')
	@ApiOperation({ summary: 'Get info of an uploaded file by it\'s name' })
	@ApiParam({ name: 'filename' })
	@ApiOkResponse({ description: 'File stats' })
	async getAttachmentInfo(
		@Param('filename') filename: string
	){
		const filePath = join(UploadDestination(), filename);

		if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

		/**
		 * I Tried to determine the mime type 
		 * from the file for an hour
		 * 
		 * It seems like it's not as easy and
		 * a little slow.
		 * 
		 * So i decided to go with the extension instead
		 */
		const extension = extname(filePath).split('.')[1];

		const stats = statSync(filePath);

		return {
			size: stats.size,
			createdAt: stats.ctimeMs,
			type: lookup(extension) || 'unknown/'+extension
		};
	}
}
