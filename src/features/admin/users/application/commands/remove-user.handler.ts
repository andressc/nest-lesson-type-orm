import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';
import { UsersRepositoryAdapter } from '../../adapters/users.repository.adapter';

export class RemoveUserCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
	constructor(
		private readonly usersRepository: UsersRepositoryAdapter,
		private readonly usersService: UsersService,
	) {}

	async execute(command: RemoveUserCommand): Promise<void> {
		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.id);
		await this.usersRepository.delete(user);
	}
}
