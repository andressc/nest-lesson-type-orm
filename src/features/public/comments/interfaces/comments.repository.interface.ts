import { CreateCommentExtendsDto } from '../dto';
import { CommentModel } from '../entity/comment.schema';
import { BanRepositoryInterface } from '../../../interfaces/ban.repository.interface';

/* eslint-disable */
export interface CommentsRepositoryInterface
	extends BanRepositoryInterface<CommentModel, CreateCommentExtendsDto> {
}
