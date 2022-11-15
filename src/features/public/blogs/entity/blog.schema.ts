import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateBlogDto } from '../dto';

export type BlogModel = Blog & Document;

@Schema()
export class Blog {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	youtubeUrl: string;

	@Prop({ required: true })
	createdAt: string;

	updateData(data: UpdateBlogDto): void {
		this.name = data.name;
		this.youtubeUrl = data.youtubeUrl;
	}
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods.updateData = Blog.prototype.updateData;
