import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateCommentDto, CreateLikeDto } from '../features/dto/comments';
import { LikesDto } from '../common/dto/likes.dto';
import { createDate } from '../common/helpers';

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

	async setLike(data: CreateLikeDto, authUserId: string, userLogin: string): Promise<this> {
		const isLikeExist = this.likes.some((v) => v.userId === authUserId);

		if (!isLikeExist)
			this.likes.push({
				userId: authUserId,
				login: userLogin,
				likeStatus: data.likeStatus,
				addedAt: createDate(),
			});

		if (isLikeExist) {
			this.likes = this.likes.map((v) =>
				v.userId === authUserId
					? {
							userId: v.userId,
							login: v.login,
							likeStatus: data.likeStatus,
							addedAt: createDate(),
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
