import { IsJWT, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NewPasswordDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	newPassword: string;
	@IsJWT()
	recoveryCode: string;
}
