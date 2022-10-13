import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateBlogDto } from '../features/dto/blogs/update-blog.dto';

export type BlogModel = Blog & Document;

@Schema()
export class Blog {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	youtubeUrl: string;

	updateData(data: UpdateBlogDto): this {
		this.name = data.name;
		this.youtubeUrl = data.youtubeUrl;
		return this;
	}
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods.updateData = Blog.prototype.updateData;
