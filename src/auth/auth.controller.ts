import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: AuthLoginDto,
  })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
	@ApiOperation({ summary: 'Register' })
	@ApiBody({
    type: CreateUserDto,
  })
  @ApiOkResponse({ type: CreateUserDto })
  async register(@Body() userDto: CreateUserDto) {
    console.log(userDto);
    return this.authService.register(userDto);
  }
}