import { CreateUserExtendsDto } from '../dto';
import { UserModel } from '../entity/user.schema';
import { MainRepositoryInterface } from '../../../interfaces/main.repository.interface';

/* eslint-disable */
export interface UsersRepositoryInterface
	extends MainRepositoryInterface<UserModel, CreateUserExtendsDto> {
	findUserByLogin(login: string): Promise<UserModel | null>;
	findUserByEmail(email: string): Promise<UserModel | null>;
	findUserByConfirmationCode(confirmationCode: string): Promise<UserModel | null>;
}

/*export abstract class UsersRepositoryInterface {
	abstract createUserModel(data: CreateUserExtendsDto): Promise<UserModel>;
	abstract findUserModel(id: string): Promise<UserModel | null>;
	abstract findUserModelByLogin(login: string): Promise<UserModel | null>;
	abstract findUserModelByEmail(email: string): Promise<UserModel | null>;
	abstract findUserModelByConfirmationCode(confirmationCode: string): Promise<UserModel | null>;
	abstract save(userModel: UserModel): Promise<UserModel>;
	abstract delete(userModel: UserModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}*/
