import { IsNotEmpty, Matches } from 'class-validator';

export class RegistrationEmailResendingDto {
	@IsNotEmpty()
	@Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
	email: string;
}
