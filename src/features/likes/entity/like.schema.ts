import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LikeStatusEnum } from '../../../common/dto';
import { ObjectId } from 'mongodb';

export type LikeModel = Like & Document;

@Schema()
export class Like {
	@Prop({ required: true })
	itemId: ObjectId;

	@Prop({ required: true })
	userId: ObjectId;

	@Prop({ required: true })
	login: string;

	@Prop({ required: true })
	likeStatus: string;

	@Prop({ required: true })
	isBanned: boolean;

	@Prop({ required: true })
	addedAt: string;

	updateLikeStatus(likeStatus: LikeStatusEnum) {
		this.likeStatus = likeStatus;
	}
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.methods.updateLikeStatus = Like.prototype.updateLikeStatus;
