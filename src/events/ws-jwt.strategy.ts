import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayloadInterface } from '../auth/jwt-payload.interface';
import { JwtStrategy } from '@/auth/jwt.strategy';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(JwtStrategy, 'jwt-socket') {}
