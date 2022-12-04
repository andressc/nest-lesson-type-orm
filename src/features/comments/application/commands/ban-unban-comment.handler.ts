import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositoryInterface } from '../../interfaces/comments.repository.interface';
import { InjectCommentsRepository } from '../../infrastructure/providers/comments-repository.provider';

export class BanUnbanCommentCommand implements ICommand {
	constructor(public userId: string, public isBanned: boolean) {}
}

@CommandHandler(BanUnbanCommentCommand)
export class BanUnbanCommentHandler implements ICommandHandler<BanUnbanCommentCommand> {
	constructor(
		@InjectCommentsRepository() private readonly commentsRepository: CommentsRepositoryInterface,
	) {}

	async execute(command: BanUnbanCommentCommand): Promise<void> {
		await this.commentsRepository.setBan(new ObjectId(command.userId), command.isBanned);
	}
}
