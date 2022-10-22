import { Injectable } from '@nestjs/common';
import { UserModel } from '../../entity/user.schema';
import { UserNotFoundException } from '../../common/exceptions/UserNotFoundException';
import { createDate } from '../../common/helpers/date.helper';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationService } from '../../features/application/validation.service';
import { UserExistsLoginException } from '../../common/exceptions/UserExistsLoginException';
import { generateHash } from '../../common/helpers/generateHash.helper';
import * as bcrypt from 'bcrypt';
import { generateConfirmationCode } from '../../common/helpers/generateConfirmationCode.helper';
import { UserExistsEmailException } from '../../common/exceptions/UserExistsEmailException';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly validationService: ValidationService,
	) {}

	async createUser(data: CreateUserDto, isConfirmed = false): Promise<string> {
		await this.validationService.validate(data, CreateUserDto);
		await this.checkUserExistsByLogin(data.login, data.email);
		await this.checkUserExistsByEmail(data.email);

		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await generateHash(data.password, passwordSalt);

		const emailConfirmation = generateConfirmationCode(isConfirmed);

		return this.userRepository.createUser({
			login: data.login,
			password: passwordHash,
			email: data.email,
			salt: passwordSalt,
			...emailConfirmation,
			createdAt: createDate(),
		});
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

	private async checkUserExistsByLogin(login: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModelByLogin(login);
		if (user) throw new UserExistsLoginException(login);
		return user;
	}

	private async checkUserExistsByEmail(email: string): Promise<UserModel> {
		const user: UserModel | null = await this.userRepository.findUserModelByEmail(email);
		if (user) throw new UserExistsEmailException(email);
		return user;
	}
}
