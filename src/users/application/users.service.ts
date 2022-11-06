import { Injectable } from '@nestjs/common';
import { UserModel } from '../../database/entity';
import { createDate, generateConfirmationCode, generateHash } from '../../common/helpers';
import { UsersRepository } from '../infrastructure/repository';
import { CreateUserDto } from '../dto';
import { ValidationService } from '../../features/application';
import * as bcrypt from 'bcrypt';
import {
	UserExistsEmailException,
	UserExistsLoginException,
	UserNotFoundException,
} from '../../common/exceptions';

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly validationService: ValidationService,
	) {}

	async createUser(data: CreateUserDto, isConfirmed = false): Promise<string> {
		await this.validationService.validate(data, CreateUserDto);

		await this.findUserByLoginOrErrorThrow(data.login);
		await this.findUserByEmailOrErrorThrow(data.email);

		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await generateHash(data.password, passwordSalt);

		const emailConfirmation = generateConfirmationCode(isConfirmed);

		const newUser: UserModel = await this.usersRepository.createUserModel({
			login: data.login,
			password: passwordHash,
			email: data.email,
			salt: passwordSalt,
			...emailConfirmation,
			createdAt: createDate(),
		});

		const result = await this.usersRepository.save(newUser);
		return result.id.toString();
	}

	async removeUser(id: string): Promise<void> {
		const user: UserModel = await this.findUserByIdOrErrorThrow(id);
		await this.usersRepository.delete(user);
	}

	private async findUserByIdOrErrorThrow(id: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	private async findUserByLoginOrErrorThrow(login: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(login);
		if (user) throw new UserExistsLoginException(login);
		return user;
	}

	private async findUserByEmailOrErrorThrow(email: string): Promise<UserModel> {
		const user: UserModel | null = await this.usersRepository.findUserModelByEmail(email);
		if (user) throw new UserExistsEmailException(email);
		return user;
	}
}
