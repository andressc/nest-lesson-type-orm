import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '../../../entity/comment.schema';
import { UpdateCommentDto, CreateCommentExtendsDto, CreateLikeDto } from '../../dto/comments';

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

	async setLike(
		comment: CommentModel,
		data: CreateLikeDto,
		authUserId: string,
		userLogin: string,
	): Promise<void> {
		const updateComment = await comment.setLike(data, authUserId, userLogin);
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
