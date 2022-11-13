import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentModel } from '../entity/comment.schema';
import { CommentNotFoundException } from '../../../common/exceptions';
import { CommentsRepositoryAdapter } from '../adapters/comments.repository.adapter';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepositoryAdapter) {}

	public async findCommentOrErrorThrow(id: string, authUserId?: string): Promise<CommentModel> {
		const comment: CommentModel | null = await this.commentsRepository.findCommentModel(id);
		if (!comment) throw new CommentNotFoundException(id);
		if (authUserId && comment.userId !== authUserId) throw new ForbiddenException();
		return comment;
	}
}
