import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../../../database/entity';
import { generateHash } from '../../../common/helpers';
import { UsersRepository } from '../../../users/infrastructure/repository';

export class ValidateUserAuthCommand {
	constructor(public login: string, public password: string) {}
}

@CommandHandler(ValidateUserAuthCommand)
export class ValidateUserAuthHandler implements ICommandHandler<ValidateUserAuthCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: ValidateUserAuthCommand): Promise<UserModel | null> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(command.login);
		if (!user) throw new UnauthorizedException();

		const passwordHash = await generateHash(command.password, user.salt);

		if (user && user.password === passwordHash && user.login === command.login) {
			return user;
		}

		return null;
	}
}
