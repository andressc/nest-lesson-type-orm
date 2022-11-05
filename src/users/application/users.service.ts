import { Injectable } from '@nestjs/common';
import { UserModel } from '../../entity/user.schema';
import { createDate, generateHash, generateConfirmationCode } from '../../common/helpers';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationService } from '../../features/application/validation.service';
import {
	UserExistsLoginException,
	UserExistsEmailException,
	UserNotFoundException,
} from '../../common/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly validationService: ValidationService,
	) {}

	async createUser(data: CreateUserDto, isConfirmed = false): Promise<string> {
		await this.validationService.validate(data, CreateUserDto);

		await this.findUserByLoginOrErrorThrow(data.login);
		await this.findUserByEmailOrErrorThrow(data.email);

		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await generateHash(data.password, passwordSalt);

		const emailConfirmation = generateConfirmationCode(isConfirmed);

		const newUser: UserModel = await this.userRepository.createUserModel({
			login: data.login,
			password: passwordHash,
			email: data.email,
			salt: passwordSalt,
			...emailConfirmation,
			createdAt: createDate(),
		});

		const result = await newUser.save();
		return result.id.toString();
	}

	async removeUser(id: string): Promise<void> {
		const user: UserModel = await this.findUserByIdOrErrorThrow(id);
		await user.delete();
	}

	private async findUserByIdOrErrorThrow(id: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	private async findUserByLoginOrErrorThrow(login: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModelByLogin(login);
		if (user) throw new UserExistsLoginException(login);
		return user;
	}

	private async findUserByEmailOrErrorThrow(email: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModelByEmail(email);
		if (user) throw new UserExistsEmailException(email);
		return user;
	}
}
