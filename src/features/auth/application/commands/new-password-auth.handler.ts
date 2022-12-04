import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../../dto';
import { UserNotFoundException } from '../../../../common/exceptions';
import { UserModel } from '../../../users/domain/user.schema';
import { UsersRepositoryInterface } from '../../../users/interfaces/users.repository.interface';
import { InjectUsersRepository } from '../../../users/infrastructure/providers/users-repository.provider';

export class NewPasswordAuthCommand {
	constructor(public data: NewPasswordDto, public userId: string) {}
}

@CommandHandler(NewPasswordAuthCommand)
export class NewPasswordAuthHandler implements ICommandHandler<NewPasswordAuthCommand> {
	constructor(
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
	) {}

	async execute(command: NewPasswordAuthCommand): Promise<void> {
		const user: UserModel | null = await this.usersRepository.find(command.userId);
		if (!user) throw new UserNotFoundException(command.userId);

		await user.updatePassword(command.data.newPassword);
		await this.usersRepository.save(user);
	}
}
