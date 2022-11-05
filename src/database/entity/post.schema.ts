import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdatePostExtendsDto } from '../../features/dto/posts';
import { CreateLikeDto, LikesDto } from '../../features/dto/comments';
import { createDate } from '../../common/helpers';

export type PostModel = Post & Document;

@Schema()
export class Post {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	shortDescription: string;

	@Prop({ required: true })
	content: string;

	@Prop({ required: true })
	blogId: string;

	@Prop({ required: true })
	blogName: string;

	@Prop({ required: true })
	createdAt: string;

	@Prop({ type: [] })
	likes: LikesDto[];

	updateData(data: UpdatePostExtendsDto): void {
		this.title = data.title;
		this.shortDescription = data.shortDescription;
		this.content = data.content;
		this.blogId = data.blogId;
		this.blogName = data.blogName;
	}

	async setLike(data: CreateLikeDto, authUserId: string, userLogin: string): Promise<void> {
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
	}
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods.updateData = Post.prototype.updateData;
PostSchema.methods.setLike = Post.prototype.setLike;
