import { CreateUserExtendsDto } from '../dto';
import { UserModel } from '../entity/user.schema';

export abstract class UsersRepositoryAdapter {
	abstract createUserModel(data: CreateUserExtendsDto): Promise<UserModel>;
	abstract findUserModel(id: string): Promise<UserModel | null>;
	abstract findUserModelByLogin(login: string): Promise<UserModel | null>;
	abstract findUserModelByEmail(email: string): Promise<UserModel | null>;
	abstract findUserModelByConfirmationCode(confirmationCode: string): Promise<UserModel | null>;
	abstract save(userModel: UserModel): Promise<UserModel>;
	abstract delete(userModel: UserModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
