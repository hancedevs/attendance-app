import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthForgotPasswordDto, AuthResetPasswordDto, AuthValidateKeyDto } from './dto/auth-password-reset.dto';

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
    return this.authService.register(userDto);
  }

  @Post('forgot-password')
	@ApiOperation({ summary: 'Forgot password' })
	@ApiBody({
    type: AuthForgotPasswordDto,
  })
  @ApiOkResponse({ example: { message: 'string' } })
  async forgotPassword(@Body() userDto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(userDto.username);
  }

  @Post('validate-reset-password-key')
	@ApiOperation({ summary: 'Validate the reset password key' })
	@ApiBody({
    type: AuthValidateKeyDto,
  })
  @ApiOkResponse({ example: { message: 'true' } })
  async validateKey(@Body() userDto: AuthValidateKeyDto) {
    const {user, ...validationResult} = await this.authService.validateUserPasswordResetTokenWithUsername(userDto);
    return validationResult;
  }

  @Post('reset-password')
	@ApiOperation({ summary: 'Reset password' })
	@ApiBody({
    type: AuthResetPasswordDto,
  })
  @ApiOkResponse({ example: { message: 'true' } })
  async resetPassword(@Body() userDto: AuthResetPasswordDto) {
    return this.authService.resetPassword(userDto);
  }
}