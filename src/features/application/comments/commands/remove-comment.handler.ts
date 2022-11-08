import { PostsRepository } from '../../../infrastructure/repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsService } from '../comments.service';
import { UsersService } from '../../../../users/application/users.service';
import { CommentModel } from '../../../../database/entity';

export class RemoveCommentCommand {
	constructor(public id: string, public authUserId: string) {}
}

@CommandHandler(RemoveCommentCommand)
export class RemoveCommentHandler implements ICommandHandler<RemoveCommentCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
	) {}

	async execute(command: RemoveCommentCommand): Promise<void> {
		await this.usersService.findUserByIdOrErrorThrow(command.authUserId);

		const comment: CommentModel = await this.commentsService.findCommentOrErrorThrow(
			command.id,
			command.authUserId,
		);
		await comment.delete();
	}
}
