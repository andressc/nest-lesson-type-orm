import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../../entity/comment.schema';
import { UpdateCommentDto } from '../../dto/comments/update-comment.dto';
import { CreateCommentExtendsDto } from '../../dto/comments/create-comment-extends.dto';

@Injectable()
export class CommentsRepository {
	constructor(@InjectModel(Comment.name) private readonly commentModel: Model<CommentModel>) {}

	async createComment(data: CreateCommentExtendsDto): Promise<string> {
		const newComment: CommentModel = new this.commentModel(data);

		const result = await newComment.save();
		return result.id.toString();
	}

	async updateComment(comment: CommentModel, data: UpdateCommentDto): Promise<void> {
		await comment.updateData(data).save();
	}

	async removeComment(comment: CommentModel): Promise<void> {
		await comment.delete();
	}

	async findCommentModel(id: string): Promise<CommentModel | null> {
		console.log(id);
		return this.commentModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.commentModel.deleteMany();
	}
}
