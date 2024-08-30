import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { comparePass, encryptPass } from '@/auth/helpers/password';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return this.prisma.user.create({ data: { ...createUserDto } });
  }

  findAll(fromId?: number, count?: number){
    return this.prisma.user.findMany({
      select: {
        username: true,
        email: true,
        name: true,
        role: true,
        id: true,
        createdAt: true
      },
      cursor: fromId ? {
        id: fromId
      } : undefined,
      take: count
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findAllByRole(role: UserRole){
    return this.prisma.user.findMany({ where: { role } });
  }

  async update(id: number, updateUserDto: UpdateUserDto, needOldPassword = true) {
    if (updateUserDto.password) {
      if(needOldPassword){
        if(!updateUserDto.currentPassword) {
          throw new UnauthorizedException('Old password not specified');
        }
        const userP = await this.prisma.user.findUnique({
          where: { id },
          select: {
            password: true
          }
        })
        if(!await comparePass(updateUserDto.currentPassword, userP.password)){
          throw new UnauthorizedException('Current password not correct.');
        }
      }
      updateUserDto.password = await encryptPass(updateUserDto.password);
    }
    return this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });
  }
}
