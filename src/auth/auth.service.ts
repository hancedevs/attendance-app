import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { comparePass } from './helpers/password';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/email/email.service';
import { NotFoundError } from 'rxjs';
import { randomBytes } from 'crypto';
import { AuthResetPasswordDto, AuthValidateKeyDto } from './dto/auth-password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private users: UsersService,
    private prisma: PrismaService,
    private email: EmailService
  ) {}

  async login(authLoginDto: AuthLoginDto){
    const user = await this.users.findOneByUsername(authLoginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials ');
    }
    const pass = await comparePass(authLoginDto.password, user.password);
    
    console.log('Passed: ', pass)
    console.log('User In DB: ', user)
    console.log('Submitted Data: ', authLoginDto)

    if (!pass) {
      throw new UnauthorizedException('Invalid Credentials ');
    }

    const payload: JwtPayloadInterface = {
      id: user.id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token, role: user.role, id: user.id, admin: (await this.prisma.admin.findFirst({ where: { userId: user.id } })) ? true : false };
  }

  async register(userDto: CreateUserDto) {

    const user = await this.users.create(userDto);

    console.log('===> REGISTER()', {
      ...user,
      original_password: userDto.password
    });

    const { password, ...result } = user;
    return result;
  }

  private generateResetCode(): string {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
  }

  async createPasswordReset(userId: number) {
    const resetCode = this.generateResetCode();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // an hour

    // Remove all reset password requests
    await this.prisma.passwordReset.deleteMany({ where: { userId } });

    return await this.prisma.passwordReset.create({
      data: {
        userId: userId,
        key: resetCode,
        expiresAt: expiresAt,
      },
    });
  }

  async forgotPassword(username: string){
    const user = await this.users.findOneByUsername(username);

    if(!user){
      throw new NotFoundException('User not found');
    }

    const resetLink = await this.createPasswordReset(user.id);

    await this.email.sendEmail(
      user.email,
      'Password Reset',
      'Here is the your Hance SA one time 6-digit code to reset yout password, It will expire in one hour: ' + resetLink.key,
      `<div style="text-align:center"><h1><b style="color: #09D0D0;">Hance</b> Super App</h1><br />Here is the your Hance SA one time 6-digit code to reset yout password, It will expire in one hour: <br /><b style="font-size: 28px">${resetLink.key}</b></div>`
    )

    return { message: 'Password reset link sent.' }
  }

	async validatePasswordResetToken(userId: number, token: string) {
    const resetRequest = await this.prisma.passwordReset.findUnique({
      where: { key: token, userId },
    });

    if (resetRequest && resetRequest.expiresAt > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  async validateUserPasswordResetTokenWithUsername(dto: AuthValidateKeyDto){
    const user = await this.users.findOneByUsername(dto.username);

    if(!user){
      throw new NotFoundException('User not found');
    }

    const isValidKey = await this.validatePasswordResetToken(user.id, dto.key);

    if(!isValidKey){
      throw new UnauthorizedException('Invalid key');
    }

    const {password, ...trimmedUser} = user;

    return {
      success: isValidKey,
      user: trimmedUser,
      message: 'Validation passed successfully.'
    };
  }

  async resetPassword(dto: AuthResetPasswordDto){
    const {user, success} = await this.validateUserPasswordResetTokenWithUsername(dto);

    if(!user || !success){
      throw new UnauthorizedException('Invalid key');
    }

    // Hard reset password
    await this.users.update(user.id, {
      password: dto.password
    }, false);

    // Remove all reset password requests
    await this.prisma.passwordReset.deleteMany({ where: { userId: user.id} });
    
    return {
      message: 'Password resetted successfully.',
      success: true
    }
  }
}