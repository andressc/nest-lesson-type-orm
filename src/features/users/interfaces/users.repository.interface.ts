import { CreateUserExtendsDto } from '../dto';
import { UserModel } from '../entity/user.schema';
import { MainRepositoryInterface } from '../../shared/interfaces/main.repository.interface';

/* eslint-disable */
export interface UsersRepositoryInterface
	extends MainRepositoryInterface<UserModel, CreateUserExtendsDto> {
	findUserByLogin(login: string): Promise<UserModel | null>;
	findUserByEmail(email: string): Promise<UserModel | null>;
	findUserByConfirmationCode(confirmationCode: string): Promise<UserModel | null>;
}
