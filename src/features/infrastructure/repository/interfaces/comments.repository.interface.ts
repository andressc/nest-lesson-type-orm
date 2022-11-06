import { CreateCommentExtendsDto } from '../../../dto/comments';
import { CommentModel } from '../../../../database/entity';

export abstract class CommentsRepositoryInterface {
	abstract createCommentModel(data: CreateCommentExtendsDto): Promise<CommentModel>;
	abstract findCommentModel(id: string): Promise<CommentModel | null>;
	abstract save(commentModel: CommentModel): Promise<CommentModel>;
	abstract delete(commentModel: CommentModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
