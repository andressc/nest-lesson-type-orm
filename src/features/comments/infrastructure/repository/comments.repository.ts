import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../entity/comment.schema';
import { CreateCommentExtendsDto } from '../../dto';
import { CommentsRepositoryAdapter } from '../../adapters/comments.repository.adapter';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository implements CommentsRepositoryAdapter {
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentModel>,
	) {}

	async createCommentModel(data: CreateCommentExtendsDto): Promise<CommentModel> {
		return new this.commentModel(data);
	}

	async findCommentModel(id: string) {
		return this.commentModel.findById(id);
	}

	async setBan(userId: ObjectId, isBanned: boolean): Promise<void> {
		await this.commentModel.updateMany({ userId }, { isBanned });
	}
	async save(commentModel: CommentModel): Promise<CommentModel> {
		return commentModel.save();
	}

	async delete(commentModel: CommentModel): Promise<void> {
		await commentModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.commentModel.deleteMany();
	}
}
