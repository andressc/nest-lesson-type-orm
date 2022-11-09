import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(10)
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	password: string;

	@IsNotEmpty()
	@Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
	email: string;
}
