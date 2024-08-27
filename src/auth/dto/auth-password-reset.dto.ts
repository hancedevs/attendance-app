import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class AuthForgotPasswordDto {

	@ApiProperty()
	@IsString()
	username: string;

}


export class AuthValidateKeyDto {

	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsString()
	key: string;

}


export class AuthResetPasswordDto extends AuthValidateKeyDto {

	@ApiProperty()
	@IsString()
	password: string;

}