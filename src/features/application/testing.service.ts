import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { PostsRepository } from '../infrastructure/repository/posts.repository';

@Injectable()
export class TestingService {
	constructor(
		private readonly blogRepository: BlogsRepository,
		private readonly postRepository: PostsRepository,
	) {}

	async removeAll(): Promise<void> {
		await this.blogRepository.deleteAll();
		await this.postRepository.deleteAll();
	}
}
