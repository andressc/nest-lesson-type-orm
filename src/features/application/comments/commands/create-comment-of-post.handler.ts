import { CommentModel, UserModel } from '../../../../database/entity';
import { createDate } from '../../../../common/helpers';
import { CommentsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentOfPostDto } from '../../../dto/comments';
import { UsersService } from '../../../../users/application/users.service';
import { PostsService } from '../../posts/posts.service';

export class CreateCommentOfPostCommand implements ICommand {
	constructor(
		public data: CreateCommentOfPostDto,
		public postId: string,
		public authUserId: string,
	) {}
}

@CommandHandler(CreateCommentOfPostCommand)
export class CreateCommentOfPostHandler implements ICommandHandler<CreateCommentOfPostCommand> {
	constructor(
		private readonly usersService: UsersService,
		private readonly postsService: PostsService,
		private readonly commentsRepository: CommentsRepository,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateCommentOfPostCommand): Promise<string> {
		await this.validationService.validate(command.data, CreateCommentOfPostDto);

		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.authUserId);
		await this.postsService.findPostOrErrorThrow(command.postId);

		const newComment: CommentModel = await this.commentsRepository.createCommentModel({
			...command.data,
			userId: command.authUserId,
			userLogin: user.login,
			postId: command.postId,
			createdAt: createDate(),
		});

		const result = await this.commentsRepository.save(newComment);
		return result.id.toString();
	}
}
