import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../../dto';
import { UserModel } from '../../../database/entity';
import { UserNotFoundException } from '../../../common/exceptions';
import { UsersRepository } from '../../../users/infrastructure/repository';

export class NewPasswordAuthCommand {
	constructor(public data: NewPasswordDto, public userId: string) {}
}

@CommandHandler(NewPasswordAuthCommand)
export class NewPasswordAuthHandler implements ICommandHandler<NewPasswordAuthCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: NewPasswordAuthCommand): Promise<void> {
		const user: UserModel | null = await this.usersRepository.findUserModel(command.userId);
		if (!user) throw new UserNotFoundException(command.userId);

		await user.updatePassword(command.data.newPassword);
		await this.usersRepository.save(user);
	}
}
