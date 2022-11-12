import { PostModel } from '../entity/post.schema';
import { LikesInfoExtended, Sort } from '../../../common/dto';

export abstract class QueryPostsRepositoryInterface {
	abstract findPostModel(id: string): Promise<PostModel | null>;
	abstract findPostQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<PostModel[] | null>;
	abstract count(searchString): Promise<number>;
	abstract countLikes(post: PostModel, currentUserId: string | null): LikesInfoExtended;
}
