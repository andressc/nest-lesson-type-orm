import { Injectable } from '@nestjs/common';
import {
	BlogsRepository,
	PostsRepository,
	CommentsRepository,
	SessionsRepository,
} from '../infrastructure/repository';
import { UsersRepository } from '../../users/infrastructure/repository';

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
