import { CreateCommentExtendsDto } from '../dto';
import { CommentModel } from '../entity/comment.schema';

export abstract class CommentsRepositoryInterface {
	abstract createCommentModel(data: CreateCommentExtendsDto): Promise<CommentModel>;
	abstract findCommentModel(id: string): Promise<CommentModel | null>;
	abstract save(commentModel: CommentModel): Promise<CommentModel>;
	abstract delete(commentModel: CommentModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
