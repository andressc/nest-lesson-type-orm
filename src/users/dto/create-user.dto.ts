import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	@MaxLength(20)
	password: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}
