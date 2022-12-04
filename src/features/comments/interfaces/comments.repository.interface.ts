import { CreateCommentExtendsDto } from '../dto';
import { CommentModel } from '../domain/comment.schema';
import { BanRepositoryInterface } from '../../shared/interfaces/ban.repository.interface';

/* eslint-disable */
export interface CommentsRepositoryInterface
	extends BanRepositoryInterface<CommentModel, CreateCommentExtendsDto> {
}
