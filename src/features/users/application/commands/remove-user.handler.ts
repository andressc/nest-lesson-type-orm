import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repository';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';

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
