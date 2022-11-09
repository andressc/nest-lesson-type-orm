import { Injectable } from '@nestjs/common';
import {
	UserExistsEmailException,
	UserExistsLoginException,
	UserNotFoundException,
} from '../../../common/exceptions';
import { UserModel } from '../entity/user.schema';
import { UsersRepositoryInterface } from '../interface/users.repository.interface';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepositoryInterface) {}

	public async findUserByIdOrErrorThrow(id: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	public async findUserByLoginOrErrorThrow(login: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(login);
		if (user) throw new UserExistsLoginException(login);
		return user;
	}

	public async findUserByEmailOrErrorThrow(email: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModelByEmail(email);
		if (user) throw new UserExistsEmailException(email);
		return user;
	}
}
