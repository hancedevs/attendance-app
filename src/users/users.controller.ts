import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user info', description: 'The logged in user info.' })
  @ApiOkResponse({ type: CreateUserDto })
  async findOne(@Request() req: { user: User }) {
		const userRaw = await this.usersService.findOne(req.user.id);
		const {password, ...user} = userRaw;
    return user;
  }

  @Patch()
  @ApiOperation({ summary: 'Change current user info' })
  @ApiBody({ description: 'The fields to change', type: CreateUserDto })
  @ApiCreatedResponse({ description: 'The changed user info', type: CreateUserDto })
  update(@Request() req: { user: User }, @Body() updateUserDto: UpdateUserDto) {
		const {password, ...updatedDto} =  updateUserDto;
    return this.usersService.update(req.user.id, updatedDto);
  }
}
