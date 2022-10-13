import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { UpdateBlogDto } from '../../dto/blogs/update-blog.dto';
import { CreateBlogDto } from '../../dto/blogs/create-blog.dto';

@Injectable()
export class BlogsRepository {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

	async createBlog(data: CreateBlogDto): Promise<string> {
		const newBlog: BlogModel = new this.blogModel(data);

		const result = await newBlog.save();
		return result.id.toString();
	}

	async updateBlog(blog: BlogModel, data: UpdateBlogDto): Promise<void> {
		await blog.updateData(data).save();
	}

	async removeBlog(blog: BlogModel): Promise<void> {
		await blog.delete();
	}

	async findBlogModel(id: string): Promise<BlogModel | null> {
		return this.blogModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.blogModel.deleteMany();
	}
}
