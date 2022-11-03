import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { PostsRepository } from '../infrastructure/repository/posts.repository';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';
import { SessionsRepository } from '../infrastructure/repository/sessions.repository';

@Injectable()
export class TestingService {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly postsRepository: PostsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly commentsRepository: CommentsRepository,
		private readonly sessionRepository: SessionsRepository,
	) {}

	async removeAll(): Promise<void> {
		await this.blogsRepository.deleteAll();
		await this.postsRepository.deleteAll();
		await this.usersRepository.deleteAll();
		await this.commentsRepository.deleteAll();
		await this.sessionRepository.deleteAll();
	}
}
