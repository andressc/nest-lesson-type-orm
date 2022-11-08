import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentModel } from '../../../database/entity';
import { CommentNotFoundException } from '../../../common/exceptions';
import { CommentsRepository } from '../../infrastructure/repository';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepository) {}

	public async findCommentOrErrorThrow(id: string, authUserId: string): Promise<CommentModel> {
		const comment: CommentModel | null = await this.commentsRepository.findCommentModel(id);
		if (!comment) throw new CommentNotFoundException(id);
		if (comment.userId !== authUserId) throw new ForbiddenException();
		return comment;
	}
}
