import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { UsersRepositoryAdapter } from '../../adapters/users.repository.adapter';
import { BanUnbanUserDto } from '../../dto/ban-unban-user.dto';
import { SessionsRepositoryAdapter } from '../../../session/adapters/sessions.repository.adapter';
import { BanUnbanLikeCommand } from '../../../likes/application/command/ban-unban-like.handler';
import { BanUnbanCommentCommand } from '../../../comments/application/commands/ban-unban-comment.handler';

export class BanUnbanUserCommand implements ICommand {
	constructor(public id: string, public data: BanUnbanUserDto) {}
}

@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserHandler implements ICommandHandler<BanUnbanUserCommand> {
	constructor(
		private readonly usersService: UsersService,
		private readonly usersRepository: UsersRepositoryAdapter,
		private readonly sessionsRepository: SessionsRepositoryAdapter,
		private readonly validationService: ValidationService,
		private readonly commandBus: CommandBus,
	) {}

	async execute(command: BanUnbanUserCommand): Promise<void> {
		await this.validationService.validate(command.data, BanUnbanUserCommand);

		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.id);
		user.banUnbanUser(command.data.isBanned, command.data.banReason, new Date().toISOString());

		await this.commandBus.execute(new BanUnbanLikeCommand(user.id, command.data.isBanned));
		await this.commandBus.execute(new BanUnbanCommentCommand(user.id, command.data.isBanned));

		if (command.data.isBanned) await this.sessionsRepository.removeAllUserSessions(user.id);

		await this.usersRepository.save(user);
	}
}
