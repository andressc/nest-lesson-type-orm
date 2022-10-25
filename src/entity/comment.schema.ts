import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateCommentDto } from '../features/dto/comments/update-comment.dto';
import { CreateLikeDto } from '../features/dto/comments/create-like.dto';
import { LikesDto } from '../features/dto/comments/likes.dto';

export type CommentModel = Comment & Document;

@Schema()
export class Comment {
	@Prop({ required: true })
	content: string;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	userLogin: string;

	@Prop({ required: true })
	postId: string;

	@Prop({ required: true })
	createdAt: string;

	@Prop({ type: [] })
	likes: LikesDto[];

	updateData(data: UpdateCommentDto): this {
		this.content = data.content;
		return this;
	}

	async setLike(data: CreateLikeDto, authUserId: string): Promise<this> {
		const isLikeExist = this.likes.some((v) => v.userId === authUserId);

		if (!isLikeExist) this.likes.push({ userId: authUserId, likeStatus: data.likeStatus });

		if (isLikeExist) {
			this.likes = this.likes.map((v) =>
				v.userId === authUserId
					? {
							userId: v.userId,
							likeStatus: data.likeStatus,
					  }
					: v,
			);
		}
		return this;
	}
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods.updateData = Comment.prototype.updateData;
CommentSchema.methods.setLike = Comment.prototype.setLike;
