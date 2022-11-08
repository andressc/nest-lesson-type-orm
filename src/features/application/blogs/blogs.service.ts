import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../infrastructure/repository';
import { BlogModel } from '../../../database/entity';
import { BlogNotFoundException } from '../../../common/exceptions';

@Injectable()
export class BlogsService {
	constructor(private readonly blogsRepository: BlogsRepository) {}

	public async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel | null = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
