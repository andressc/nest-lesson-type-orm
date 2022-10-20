import { CreateUserDto } from './create-user.dto';

export class CreateUserExtendsDto extends CreateUserDto {
	createdAt: string;
}
