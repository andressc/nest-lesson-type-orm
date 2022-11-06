import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../../database/entity';
import { CreateBlogExtendsDto } from '../../dto/blogs';

@Injectable()
export class BlogsRepository {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

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
