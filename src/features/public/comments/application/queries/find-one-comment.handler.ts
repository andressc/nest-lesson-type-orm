import { CommentModel } from '../../entity/comment.schema';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentNotFoundException } from '../../../../../common/exceptions';
import { ResponseCommentDto } from '../../dto';
import { QueryCommentsRepositoryAdapter } from '../../adapters/query.comments.repository.adapter';
import { ObjectId } from 'mongodb';

export class FindOneCommentCommand {
	constructor(public id: string, public currentUserId: string | null) {}
}

@QueryHandler(FindOneCommentCommand)
export class FindOneCommentHandler implements IQueryHandler<FindOneCommentCommand> {
	constructor(private readonly queryCommentsRepository: QueryCommentsRepositoryAdapter) {}

	async execute(command: FindOneCommentCommand): Promise<ResponseCommentDto> {
		const comment: CommentModel[] | null = await this.queryCommentsRepository.findCommentModel(
			new ObjectId(command.id),
		);
		if (!comment[0]) throw new CommentNotFoundException(command.id);

		const commentModel = comment[0];

		const likesInfo = this.queryCommentsRepository.countLikes(commentModel, command.currentUserId);

		return {
			id: commentModel._id.toString(),
			content: commentModel.content,
			userId: commentModel.userId,
			userLogin: commentModel.userLogin,
			createdAt: commentModel.createdAt,
			likesInfo,
		};
	}
}
