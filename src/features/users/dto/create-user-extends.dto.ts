import { CreateUserDto } from './create-user.dto';

export class CreateUserExtendsDto extends CreateUserDto {
	salt: string;
	confirmationCode: string;
	expirationDate: Date;
	isConfirmed: boolean;
	isBanned: boolean;
	banReason: string;
	createdAt: string;
}
