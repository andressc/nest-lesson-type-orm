import { PostModel } from '../entity/post.schema';
import { CountLikesRepositoryInterface } from '../../shared/interfaces/count.likes.repository.interface';
import { LikesInfoExtended } from '../../../common/dto';

/* eslint-disable */
export interface QueryPostsRepositoryInterface
	extends CountLikesRepositoryInterface<PostModel, LikesInfoExtended> {
}

/*export abstract class QueryPostsRepositoryInterface {
	abstract findPostModel(id: ObjectId): Promise<PostModel[] | null>;
	abstract findPostQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<PostModel[] | null>;
	abstract count(searchString): Promise<number>;
	abstract countLikes(post: PostModel, currentUserId: string | null): LikesInfoExtended;
}*/
