import { CommentModel } from '../../../../database/entity';
import { CommentsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../../../dto/comments';
import { CommentsService } from '../comments.service';
import { PostsService } from '../../posts/posts.service';
import { UsersService } from '../../../../users/application/users.service';

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
