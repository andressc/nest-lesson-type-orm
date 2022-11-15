import { CreateUserDto } from './create-user.dto';

export class CreateUserExtendsDto extends CreateUserDto {
	salt: string;
	confirmationCode: string;
	expirationDate: Date;
	isConfirmed: boolean;
	createdAt: string;
}
