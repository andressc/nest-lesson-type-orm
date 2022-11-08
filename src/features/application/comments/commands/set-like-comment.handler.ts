import { CommentModel, UserModel } from '../../../../database/entity';
import { CommentsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../dto/comments';
import { UsersService } from '../../../../users/application/users.service';
import { CommentsService } from '../comments.service';

export class SetLikeCommentCommand implements ICommand {
	constructor(public commentId: string, public authUserId: string, public data: CreateLikeDto) {}
}

@CommandHandler(SetLikeCommentCommand)
export class SetLikeCommentHandler implements ICommandHandler<SetLikeCommentCommand> {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
		private readonly commentsRepository: CommentsRepository,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: SetLikeCommentCommand): Promise<void> {
		await this.validationService.validate(command.data, CreateLikeDto);

		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.authUserId);

		const comment: CommentModel = await this.commentsService.findCommentOrErrorThrow(
			command.commentId,
			command.authUserId,
		);

		await comment.setLike(command.data, command.authUserId, user.login);
		await this.commentsRepository.save(comment);
	}
}
