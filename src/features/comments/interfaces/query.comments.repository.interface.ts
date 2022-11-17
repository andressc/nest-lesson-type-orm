import { CommentModel } from '../entity/comment.schema';
import { CountLikesRepositoryInterface } from '../../interfaces/count.likes.repository.interface';
import { LikesInfo } from '../../../common/dto';

/* eslint-disable */
export interface QueryCommentsRepositoryInterface
	extends CountLikesRepositoryInterface<CommentModel, LikesInfo> {
}
