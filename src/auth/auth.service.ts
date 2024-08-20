import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { comparePass } from './helpers/password';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private users: UsersService,
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

    return { token, role: user.role, id: user.id };
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
}