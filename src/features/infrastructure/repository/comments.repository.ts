import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../../entity/comment.schema';
import { UpdateCommentDto } from '../../dto/comments/update-comment.dto';
import { CreateCommentExtendsDto } from '../../dto/comments/create-comment-extends.dto';
import { CreateLikeDto } from '../../dto/comments/create-like.dto';

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

	async setLike(comment: CommentModel, data: CreateLikeDto, authUserId: string): Promise<void> {
		const updateComment = await comment.setLike(data, authUserId);
		await updateComment.save();
		/*await comment.updateOne(
			{ likes: { userId: authUserId, likeStatus: data.likeStatus } },
			{ $set: { likes: { userId: authUserId, likeStatus: data.likeStatus } } },
		);*/
		/*await comment.update(
			{ likes: { userId: authUserId, likeStatus: data.likeStatus } },
			{ $addToSet: { likes: { likeStatus: data.likeStatus } } },
		);*/
		/*await comment.update(
			{ likes: { userId: authUserId } },
			{ $push: { likes: { userId: authUserId, likeStatus: data.likeStatus } } },
		);*/
	}

	async removeComment(comment: CommentModel): Promise<void> {
		await comment.delete();
	}

	async findCommentModel(id: string): Promise<CommentModel | null> {
		return this.commentModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.commentModel.deleteMany();
	}
}
