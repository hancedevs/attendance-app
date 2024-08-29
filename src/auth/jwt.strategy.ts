import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
    });
  }

  async validate(payload: JwtPayloadInterface) {
    const { id, role } = payload;


    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
        role,
      },
    });

    // console.log(payload);
    // console.log(staff);

    if (!user) {
      return {
        "error": "Unauthorized",
        "message": "Not authorized"
      }
    }
    const {password, ...userInfo} = user;
    return userInfo;
  }
}
