import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}
