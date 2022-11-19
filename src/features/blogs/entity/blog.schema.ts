import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateBlogDto } from '../dto';

export type BlogModel = Blog & Document;

@Schema()
export class Blog {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	websiteUrl: string;

	@Prop({ required: true })
	createdAt: string;

	@Prop({ required: true })
	description: string;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	userLogin: string;

	updateData(data: UpdateBlogDto): void {
		this.name = data.name;
		this.description = data.description;
		this.websiteUrl = data.websiteUrl;
	}

	bindBlogWithUser(userId: string, userLogin: string): void {
		this.userId = userId;
		this.userLogin = userLogin;
	}
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods.updateData = Blog.prototype.updateData;
BlogSchema.methods.bindBlogWithUser = Blog.prototype.bindBlogWithUser;
