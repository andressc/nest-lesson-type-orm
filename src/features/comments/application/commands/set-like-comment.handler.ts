import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../dto';
import { UsersService } from '../../../users/application/users.service';
import { CommentsService } from '../comments.service';
import { UserModel } from '../../../users/entity/user.schema';
import { CommentModel } from '../../entity/comment.schema';
import { ValidationService } from '../../../application/validation.service';
import { CommentsRepositoryInterface } from '../../interface/comments.repository.interface';

export class SetLikeCommentCommand implements ICommand {
	constructor(public commentId: string, public authUserId: string, public data: CreateLikeDto) {}
}

@CommandHandler(SetLikeCommentCommand)
export class SetLikeCommentHandler implements ICommandHandler<SetLikeCommentCommand> {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
		private readonly commentsRepository: CommentsRepositoryInterface,
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
