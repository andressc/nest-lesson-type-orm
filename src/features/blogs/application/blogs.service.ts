import { Injectable } from '@nestjs/common';
import { BlogNotFoundException } from '../../../common/exceptions';
import { BlogModel } from '../domain/blog.schema';
import { BlogsRepositoryInterface } from '../interfaces/blogs.repository.interface';
import { InjectBlogsRepository } from '../infrastructure/providers/blogs-repository.provider';

@Injectable()
export class BlogsService {
	constructor(
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
	) {}

	public async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.find(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
