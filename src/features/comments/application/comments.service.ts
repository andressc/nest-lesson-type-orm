import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentModel } from '../domain/comment.schema';
import { CommentNotFoundException } from '../../../common/exceptions';
import { CommentsRepositoryInterface } from '../interfaces/comments.repository.interface';
import { InjectCommentsRepository } from '../infrastructure/providers/comments-repository.provider';

@Injectable()
export class CommentsService {
	constructor(
		@InjectCommentsRepository() private readonly commentsRepository: CommentsRepositoryInterface,
	) {}

	public async findCommentOrErrorThrow(id: string, authUserId?: string): Promise<CommentModel> {
		const comment: CommentModel | null = await this.commentsRepository.find(id);
		if (!comment) throw new CommentNotFoundException(id);
		if (authUserId && comment.userId !== authUserId) throw new ForbiddenException();
		return comment;
	}
}
