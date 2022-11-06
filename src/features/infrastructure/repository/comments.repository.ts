import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../../database/entity';
import { CreateCommentExtendsDto } from '../../dto/comments';

@Injectable()
export class CommentsRepository {
	constructor(@InjectModel(Comment.name) private readonly commentModel: Model<CommentModel>) {}

	async createCommentModel(data: CreateCommentExtendsDto): Promise<CommentModel> {
		return new this.commentModel(data);
	}

	async findCommentModel(id: string): Promise<CommentModel | null> {
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
	}
}
