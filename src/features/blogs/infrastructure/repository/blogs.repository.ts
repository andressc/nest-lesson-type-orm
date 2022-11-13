import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../entity/blog.schema';
import { CreateBlogExtendsDto } from '../../dto';
import { BlogsRepositoryAdapter } from '../../adapters/blogs.repository.adapter';

@Injectable()
export class BlogsRepository implements BlogsRepositoryAdapter {
	constructor(
		@InjectModel(Blog.name)
		private readonly blogModel: Model<BlogModel>,
	) {}

	async createBlogModel(data: CreateBlogExtendsDto): Promise<BlogModel> {
		return new this.blogModel(data);
	}

	async findBlogModel(id: string): Promise<BlogModel | null> {
		return this.blogModel.findById(id);
	}

	async save(blogModel: BlogModel): Promise<BlogModel> {
		return blogModel.save();
	}

	async delete(blogModel: BlogModel): Promise<void> {
		await blogModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.blogModel.deleteMany();
	}
}
