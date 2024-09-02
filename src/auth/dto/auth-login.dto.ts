import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsLowercase, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsLowercase()
  username: string;

  /**
   * Password field is required for login
   * @type {string}
   */
  @ApiProperty()
  @IsNotEmpty()
  password: string;

}