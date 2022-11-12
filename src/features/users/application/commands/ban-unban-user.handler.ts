import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';
import { ValidationService } from '../../../application/validation.service';
import { UsersRepositoryInterface } from '../../interface/users.repository.interface';
import { BanUnbanUserDto } from '../../dto/ban-unban-user.dto';
import { SessionsRepositoryInterface } from '../../../session/interface/sessions.repository.interface';

export class BanUnbanUserCommand implements ICommand {
	constructor(public id: string, public data: BanUnbanUserDto) {}
}

@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserHandler implements ICommandHandler<BanUnbanUserCommand> {
	constructor(
		private readonly usersService: UsersService,
		private readonly usersRepository: UsersRepositoryInterface,
		private readonly sessionsRepository: SessionsRepositoryInterface,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: BanUnbanUserCommand): Promise<void> {
		await this.validationService.validate(command.data, BanUnbanUserCommand);

		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.id);
		user.banUnbanUser(command.data.isBanned, command.data.banReason);

		if (command.data.isBanned) await this.sessionsRepository.removeAllUserSessions(user.id);

		await this.usersRepository.save(user);
	}
}
