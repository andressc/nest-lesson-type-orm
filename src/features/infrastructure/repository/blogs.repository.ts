import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { CreateBlogExtendsDto } from '../../dto/blogs/create-blog-extends.dto';

@Injectable()
export class BlogsRepository {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

	async createBlogModel(data: CreateBlogExtendsDto): Promise<BlogModel> {
		return new this.blogModel(data);
	}

	async findBlogModel(id: string): Promise<BlogModel | null> {
		return this.blogModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.blogModel.deleteMany();
	}
}
