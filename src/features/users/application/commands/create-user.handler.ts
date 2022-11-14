import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto';
import * as bcrypt from 'bcrypt';
import { createDate, generateConfirmationCode, generateHash } from '../../../../common/helpers';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { UsersRepositoryAdapter } from '../../adapters/users.repository.adapter';

export class CreateUserCommand implements ICommand {
	constructor(public data: CreateUserDto, public isConfirmed = false) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		private readonly usersService: UsersService,
		private readonly usersRepository: UsersRepositoryAdapter,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateUserCommand): Promise<string> {
		await this.validationService.validate(command.data, CreateUserDto);

		await this.usersService.findUserByLoginOrErrorThrow(command.data.login);
		await this.usersService.findUserByEmailOrErrorThrow(command.data.email);

		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await generateHash(command.data.password, passwordSalt);

		const emailConfirmation = generateConfirmationCode(command.isConfirmed);

		const newUser: UserModel = await this.usersRepository.createUserModel({
			login: command.data.login,
			password: passwordHash,
			email: command.data.email,
			salt: passwordSalt,
			...emailConfirmation,
			createdAt: createDate(),
		});

		const result = await this.usersRepository.save(newUser);
		return result.id.toString();
	}
}
