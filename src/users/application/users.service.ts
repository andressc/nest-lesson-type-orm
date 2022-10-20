import { Injectable } from '@nestjs/common';
import { UserModel } from '../../entity/user.schema';
import { UserNotFoundException } from '../../common/exceptions/UserNotFoundException';
import { createDate } from '../../common/helpers/date.helper';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationService } from '../../features/application/validation.service';
import { UserExistsException } from '../../common/exceptions/UserExistsException';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly validationService: ValidationService,
	) {}

	async createUser(data: CreateUserDto): Promise<string> {
		await this.validationService.validate(data, CreateUserDto);
		await this.checkUserExists(data.login, data.email);

		return this.userRepository.createUser({ ...data, createdAt: createDate() });
	}

	async removeUser(id: string): Promise<void> {
		const user: UserModel = await this.checkUserExistsById(id);
		await this.userRepository.removeUser(user);
	}

	private async checkUserExistsById(id: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	private async checkUserExists(login: string, email: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModelByEmailOrLogin(
			login,
			email,
		);
		if (user) throw new UserExistsException(login, email);
		return user;
	}
}
