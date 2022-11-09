import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { UserModel } from '../../entity/user.schema';
import { UsersRepositoryInterface } from '../../interface/users.repository.interface';

export class RemoveUserCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
	constructor(
		private readonly usersRepository: UsersRepositoryInterface,
		private readonly usersService: UsersService,
	) {}

	async execute(command: RemoveUserCommand): Promise<void> {
		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.id);
		await this.usersRepository.delete(user);
	}
}
