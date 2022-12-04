import { CommentModel } from '../../domain/comment.schema';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentNotFoundException } from '../../../../common/exceptions';
import { ResponseCommentDto } from '../../dto';
import { QueryCommentsRepositoryInterface } from '../../interfaces/query.comments.repository.interface';
import { ObjectId } from 'mongodb';
import { InjectQueryCommentsRepository } from '../../infrastructure/providers/query-comments-repository.provider';

export class FindOneCommentCommand {
	constructor(public id: string, public currentUserId: string | null) {}
}

@QueryHandler(FindOneCommentCommand)
export class FindOneCommentHandler implements IQueryHandler<FindOneCommentCommand> {
	constructor(
		@InjectQueryCommentsRepository()
		private readonly queryCommentsRepository: QueryCommentsRepositoryInterface,
	) {}

	async execute(command: FindOneCommentCommand): Promise<ResponseCommentDto> {
		const comment: CommentModel | null = await this.queryCommentsRepository.find(
			new ObjectId(command.id),
		);
		if (!comment) throw new CommentNotFoundException(command.id);

		const likesInfo = this.queryCommentsRepository.countLikes(comment, command.currentUserId);

		return {
			id: comment._id.toString(),
			content: comment.content,
			userId: comment.userId,
			userLogin: comment.userLogin,
			createdAt: comment.createdAt,
			likesInfo,
		};
	}
}
