import { CommentModel } from '../../../../database/entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentNotFoundException } from '../../../../common/exceptions';
import { ObjectIdDto } from '../../../../common/dto';
import { ResponseCommentDto } from '../../../dto/comments';
import { QueryCommentsRepository } from '../../../infrastructure/query';

export class FindOneCommentCommand {
	constructor(public id: string, public currentUserId: ObjectIdDto | null) {}
}

@QueryHandler(FindOneCommentCommand)
export class FindOneCommentHandler implements IQueryHandler<FindOneCommentCommand> {
	constructor(private readonly queryCommentsRepository: QueryCommentsRepository) {}

	async execute(command: FindOneCommentCommand): Promise<ResponseCommentDto> {
		const comment: CommentModel | null = await this.queryCommentsRepository.findCommentModel(
			command.id,
		);
		if (!comment) throw new CommentNotFoundException(command.id);

		const likesInfo = this.queryCommentsRepository.countLikes(comment, command.currentUserId);

		return {
			id: comment.id.toString(),
			content: comment.content,
			userId: comment.userId,
			userLogin: comment.userLogin,
			createdAt: comment.createdAt,
			likesInfo,
		};
	}
}
