import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../entity/comment.schema';
import { CreateCommentExtendsDto } from '../../dto';
import { CommentsRepositoryInterface } from '../../interfaces/comments.repository.interface';
import { ObjectId } from 'mongodb';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';

@Injectable()
export class CommentsRepository
	extends MainRepository<CommentModel, CreateCommentExtendsDto>
	implements CommentsRepositoryInterface
{
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentModel>,
	) {
		super(commentModel);
	}

	async setBan(userId: ObjectId, isBanned: boolean): Promise<void> {
		await this.commentModel.updateMany({ userId }, { isBanned });
	}

	/*async create(data: CreateCommentExtendsDto): Promise<CommentModel> {
		return new this.commentModel(data);
	}

	async find(id: string) {
		return this.commentModel.findById(id);
	}

	async save(commentModel: CommentModel): Promise<CommentModel> {
		return commentModel.save();
	}

	async delete(commentModel: CommentModel): Promise<void> {
		await commentModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.commentModel.deleteMany();
	}*/
}
