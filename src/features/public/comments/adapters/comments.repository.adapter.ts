import { CreateCommentExtendsDto } from '../dto';
import { CommentModel } from '../entity/comment.schema';
import { ObjectId } from 'mongodb';

export abstract class CommentsRepositoryAdapter {
	abstract createCommentModel(data: CreateCommentExtendsDto): Promise<CommentModel>;
	abstract findCommentModel(id: string): Promise<CommentModel | null>;
	abstract setBan(userId: ObjectId, isBanned: boolean): Promise<void>;
	abstract save(commentModel: CommentModel): Promise<CommentModel>;
	abstract delete(commentModel: CommentModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
