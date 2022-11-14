import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateRequestLikeDto } from '../../dto';
import { CommentModel } from '../../entity/comment.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { CommentsRepositoryAdapter } from '../../adapters/comments.repository.adapter';
import { CreateLikeCommand } from '../../../likes/application/command/create-like.handler';
import { CommentNotFoundException } from '../../../../common/exceptions';

export class CreateLikeCommentCommand implements ICommand {
	constructor(
		public commentId: string,
		public userId: string,
		public userLogin: string,
		public data: CreateRequestLikeDto,
	) {}
}

@CommandHandler(CreateLikeCommentCommand)
export class CreateLikeCommentHandler implements ICommandHandler<CreateLikeCommentCommand> {
	constructor(
		private readonly commentsRepository: CommentsRepositoryAdapter,
		private readonly validationService: ValidationService,
		private readonly commandBus: CommandBus,
	) {}

	async execute(command: CreateLikeCommentCommand): Promise<void> {
		await this.validationService.validate(command.data, CreateRequestLikeDto);

		const comment: CommentModel = await this.commentsRepository.findCommentModel(command.commentId);
		if (!comment) throw new CommentNotFoundException(command.commentId);

		await this.commandBus.execute(
			new CreateLikeCommand(command.commentId, command.userId, command.userLogin, command.data),
		);
	}
}
