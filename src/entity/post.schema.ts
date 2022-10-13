import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdatePostExtendsDto } from '../features/dto/posts/update-post-extends.dto';

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

	updateData(data: UpdatePostExtendsDto): this {
		this.title = data.title;
		this.shortDescription = data.shortDescription;
		this.content = data.content;
		this.blogId = data.blogId;
		this.blogName = data.blogName;
		return this;
	}
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods.updateData = Post.prototype.updateData;
