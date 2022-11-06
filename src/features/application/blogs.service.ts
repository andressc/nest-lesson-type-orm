import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository';
import { BlogModel } from '../../database/entity';
import { ValidationService } from './validation.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blogs';
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
		const result: BlogModel = await this.blogsRepository.save(newBlog);
		return result.id.toString();
	}

	async updateBlog(id: string, data: UpdateBlogDto): Promise<void> {
		await this.validationService.validate(data, UpdateBlogDto);

		const blog: BlogModel = await this.findBlogOrErrorThrow(id);
		blog.updateData(data);
		await this.blogsRepository.save(blog);
	}

	async removeBlog(id: string): Promise<void> {
		const blog: BlogModel = await this.findBlogOrErrorThrow(id);
		await this.blogsRepository.delete(blog);
	}

	private async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
