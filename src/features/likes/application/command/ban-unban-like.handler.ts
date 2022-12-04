import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepositoryInterface } from '../../interfaces/likes.repository.interface';
import { ObjectId } from 'mongodb';
import { InjectLikesRepository } from '../../infrastructure/providers/likes-repository.provider';

export class BanUnbanLikeCommand implements ICommand {
	constructor(public userId: string, public isBanned: boolean) {}
}

@CommandHandler(BanUnbanLikeCommand)
export class BanUnbanLikeHandler implements ICommandHandler<BanUnbanLikeCommand> {
	constructor(
		@InjectLikesRepository() private readonly likesRepository: LikesRepositoryInterface,
	) {}

	async execute(command: BanUnbanLikeCommand): Promise<void> {
		await this.likesRepository.setBan(new ObjectId(command.userId), command.isBanned);
	}
}
