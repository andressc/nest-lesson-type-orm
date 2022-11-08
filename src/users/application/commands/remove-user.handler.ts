import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserModel } from '../../../database/entity';
import { UsersRepository } from '../../infrastructure/repository';
import { UsersService } from '../users.service';

export class RemoveUserCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly usersService: UsersService,
	) {}

	async execute(command: RemoveUserCommand): Promise<void> {
		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.id);
		await this.usersRepository.delete(user);
	}
}
