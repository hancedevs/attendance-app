import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  /**
   * Password field is required for login
   * @type {string}
   */
  @ApiProperty()
  @IsNotEmpty()
  password: string;

}