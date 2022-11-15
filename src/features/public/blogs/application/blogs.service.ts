import { Injectable } from '@nestjs/common';
import { BlogNotFoundException } from '../../../../common/exceptions';
import { BlogModel } from '../entity/blog.schema';
import { BlogsRepositoryAdapter } from '../adapters/blogs.repository.adapter';

@Injectable()
export class BlogsService {
	constructor(private readonly blogsRepository: BlogsRepositoryAdapter<BlogModel>) {}

	public async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.find(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
