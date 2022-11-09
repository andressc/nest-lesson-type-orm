import { CommentModel } from '../../entity/comment.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../../dto';
import { CommentsService } from '../comments.service';
import { PostsService } from '../../../posts/application/posts.service';
import { UsersService } from '../../../users/application/users.service';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { ValidationService } from '../../../application/validation.service';

export class UpdateCommentCommand {
	constructor(public id: string, public data: UpdateCommentDto, public authUserId: string) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
	constructor(
		private readonly commentsRepository: CommentsRepository,
		private readonly postsService: PostsService,
		private readonly usersService: UsersService,
		private readonly commentsService: CommentsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: UpdateCommentCommand): Promise<void> {
		await this.validationService.validate(command.data, UpdateCommentDto);

		await this.usersService.findUserByIdOrErrorThrow(command.authUserId);
		const comment: CommentModel = await this.commentsService.findCommentOrErrorThrow(
			command.id,
			command.authUserId,
		);

		comment.updateData(command.data);
		await this.commentsRepository.save(comment);
	}
}
