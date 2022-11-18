import { PostModel } from '../entity/post.schema';
import { CountLikesRepositoryInterface } from '../../shared/interfaces/count.likes.repository.interface';
import { LikesInfoExtended } from '../../../common/dto';

/* eslint-disable */
export interface QueryPostsRepositoryInterface
	extends CountLikesRepositoryInterface<PostModel, LikesInfoExtended> {
}
