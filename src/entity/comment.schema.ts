import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateCommentDto } from '../features/dto/comments/update-comment.dto';

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

	updateData(data: UpdateCommentDto): this {
		this.content = data.content;
		return this;
	}
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods.updateData = Comment.prototype.updateData;
