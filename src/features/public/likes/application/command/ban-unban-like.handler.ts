import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepositoryAdapter } from '../../adapters/likes.repository.adapter';
import { ObjectId } from 'mongodb';

export class BanUnbanLikeCommand implements ICommand {
	constructor(public userId: string, public isBanned: boolean) {}
}

@CommandHandler(BanUnbanLikeCommand)
export class BanUnbanLikeHandler implements ICommandHandler<BanUnbanLikeCommand> {
	constructor(private readonly likesRepository: LikesRepositoryAdapter) {}

	async execute(command: BanUnbanLikeCommand): Promise<void> {
		await this.likesRepository.setBan(new ObjectId(command.userId), command.isBanned);
	}
}
