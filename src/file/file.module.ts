import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { UsersService } from '@/users/users.service';

@Module({
	providers: [FileService, UsersService]
})
export class FileModule {}
