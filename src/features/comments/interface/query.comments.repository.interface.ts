import { CommentModel } from '../entity/comment.schema';
import { LikesInfo, Sort } from '../../../common/dto';

export abstract class QueryCommentsRepositoryInterface {
	abstract findCommentModel(id: string): Promise<CommentModel | null>;
	abstract findCommentQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<CommentModel[] | null>;
	abstract count(searchString): Promise<number>;
	abstract countLikes(comment: CommentModel, currentUserId: string | null): LikesInfo;
}
