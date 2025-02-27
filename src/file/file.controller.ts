import { UploadDestination } from '@/const/upload-destination';
import { Controller, Get, NotFoundException, Param, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync, statfsSync, statSync } from 'fs';
import { basename, extname, join } from 'path';
import { lookup, types } from 'mime-types';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { toPng } from 'jdenticon';
import { UsersService } from '@/users/users.service';
import { createHash } from 'crypto';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('avatar/:username')
  @ApiOperation({ summary: 'User\'s avatar' })
  @ApiOkResponse({ description: 'Image' })
  async getUserAvatar(
    @Param('username') username: string,
    @Res() res: Response,
    @Query('size') imageSize: string,
    @Query('backColor') background: string
  ){
    const isID = !isNaN(+username);
    const userRaw = isID ? await this.usersService.findOne(+username) : await this.usersService.findOneByUsername(username);

    if(!userRaw) {
      throw new NotFoundException('User not found');
    }

    const size = imageSize ? +imageSize : 200;
    const backColor = background ? '#' + background : '';
    
    return res.end(toPng(createHash('sha256').update(userRaw.username+userRaw.email).digest('hex'), size, {
      backColor
    }));
  }


	@Post()
	@UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: UploadDestination(),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const name = basename(file.originalname, ext).replace(/[\W\s]/g, '_').replace(/[_]+/, '_').replace(/^_/, '');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }))
	async uploadOne(
		@UploadedFile() file: Express.Multer.File,
	){
		return {
			filename: basename(file.path)
		};
	}

	@Post('multi')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: UploadDestination(),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const name = basename(file.originalname, ext).replace(/[\W\s]/g, '_').replace(/[_]+/, '_').replace(/^_/, '');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }))
  async uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files.map(file => basename(file.path));
  }

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
