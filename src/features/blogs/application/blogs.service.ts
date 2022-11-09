import { Injectable } from '@nestjs/common';
import { BlogNotFoundException } from '../../../common/exceptions';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { BlogModel } from '../entity/blog.schema';

@Injectable()
export class BlogsService {
	constructor(private readonly blogsRepository: BlogsRepository) {}

	public async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
