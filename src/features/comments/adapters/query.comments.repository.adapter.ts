import { CommentModel } from '../entity/comment.schema';
import { LikesInfo, Sort } from '../../../common/dto';
import { ObjectId } from 'mongodb';

export abstract class QueryCommentsRepositoryAdapter {
	abstract findCommentModel(id: ObjectId): Promise<CommentModel[] | null>;
	abstract findCommentQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<CommentModel[] | null>;
	abstract count(searchString): Promise<number>;
	abstract countLikes(comment: CommentModel, currentUserId: string | null): LikesInfo;
}
