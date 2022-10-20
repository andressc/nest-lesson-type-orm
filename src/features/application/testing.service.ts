import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { PostsRepository } from '../infrastructure/repository/posts.repository';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';

@Injectable()
export class TestingService {
	constructor(
		private readonly blogRepository: BlogsRepository,
		private readonly postRepository: PostsRepository,
		private readonly userRepository: UsersRepository,
	) {}

	async removeAll(): Promise<void> {
		await this.blogRepository.deleteAll();
		await this.postRepository.deleteAll();
		await this.userRepository.deleteAll();
	}
}
