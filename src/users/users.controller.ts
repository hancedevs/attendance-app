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
  NotFoundException,
  Response,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from '@/events/events.service';
import { toPng } from 'jdenticon';
import { Response as ResponseType } from 'express';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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

  @Get(':username')
  @ApiOperation({ summary: 'Information about a user via username' })
  @ApiOkResponse({ type: CreateUserDto })
  async getUser(
    @Param('username') username: string
  ){
    const isID = !isNaN(+username);
    const userRaw = isID ? await this.usersService.findOne(+username) : await this.usersService.findOneByUsername(username);

    if(!userRaw) {
      throw new NotFoundException('User not found');
    }
    
    const {password, ...user} = userRaw;
    return user;
  }

  @Get(':username/avatar')
  @ApiOperation({ summary: 'User\'s avatar' })
  @ApiOkResponse({ description: 'Image' })
  async getUserAvatar(
    @Param('username') username: string,
    @Res() res: ResponseType,
    @Query('size') imageSize: string
  ){
    const isID = !isNaN(+username);
    const userRaw = isID ? await this.usersService.findOne(+username) : await this.usersService.findOneByUsername(username);

    if(!userRaw) {
      throw new NotFoundException('User not found');
    }

    const size = imageSize ? +imageSize : 200;
    
    return res.end(toPng(userRaw.username, size));
  }

  @Get(':username/online')
	@ApiOperation({ summary: 'Check if a user is online via username' })
  @ApiOkResponse({ example: { username: 'string', online: true } })
  checkOnline(
    @Param('username') username: string
  ){
    return {
      username,
      online: this.eventsService.onlineUsers.includes(username)
    };
  }
}
