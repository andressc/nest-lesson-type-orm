import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositoryAdapter } from '../../adapters/comments.repository.adapter';

export class BanUnbanCommentCommand implements ICommand {
	constructor(public userId: string, public isBanned: boolean) {}
}

@CommandHandler(BanUnbanCommentCommand)
export class BanUnbanCommentHandler implements ICommandHandler<BanUnbanCommentCommand> {
	constructor(private readonly commentsRepository: CommentsRepositoryAdapter) {}

	async execute(command: BanUnbanCommentCommand): Promise<void> {
		await this.commentsRepository.setBan(new ObjectId(command.userId), command.isBanned);
	}
}
