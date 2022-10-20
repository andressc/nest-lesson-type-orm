import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	login: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	password: string;
}
