import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

}
