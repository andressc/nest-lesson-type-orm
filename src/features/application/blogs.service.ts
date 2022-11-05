import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { BlogModel } from '../../entity/blog.schema';
import { ValidationService } from './validation.service';
import { CreateBlogDto } from '../dto/blogs/create-blog.dto';
import { UpdateBlogDto } from '../dto/blogs/update-blog.dto';
import { BlogNotFoundException } from '../../common/exceptions';
import { createDate } from '../../common/helpers';

@Injectable()
export class BlogsService {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly validationService: ValidationService,
	) {}

	async createBlog(data: CreateBlogDto): Promise<string> {
		await this.validationService.validate(data, CreateBlogDto);

		const newBlog: BlogModel = await this.blogsRepository.createBlogModel({
			...data,
			createdAt: createDate(),
		});
		const result = await newBlog.save();
		return result.id.toString();
	}

	async updateBlog(id: string, data: UpdateBlogDto): Promise<void> {
		await this.validationService.validate(data, UpdateBlogDto);

		const blog: BlogModel = await this.findBlogOrErrorThrow(id);
		blog.updateData(data);
		await blog.save();
	}

	async removeBlog(id: string): Promise<void> {
		const blog: BlogModel = await this.findBlogOrErrorThrow(id);
		await blog.delete();
	}

	private async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
