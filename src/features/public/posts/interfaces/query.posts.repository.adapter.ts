import { PostModel } from '../entity/post.schema';
import { LikesInfoExtended, Sort } from '../../../../common/dto';
import { ObjectId } from 'mongodb';

export abstract class QueryPostsRepositoryAdapter {
	abstract findPostModel(id: ObjectId): Promise<PostModel[] | null>;
	abstract findPostQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<PostModel[] | null>;
	abstract count(searchString): Promise<number>;
	abstract countLikes(post: PostModel, currentUserId: string | null): LikesInfoExtended;
}
