import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryInterface } from '../../../blogs/interfaces/blogs.repository.interface';
import { CommentsRepositoryInterface } from '../../../comments/interfaces/comments.repository.interface';
import { PostsRepositoryInterface } from '../../../posts/interfaces/posts.repository.interface';
import { SessionsRepositoryInterface } from '../../../session/interfaces/sessions.repository.interface';
import { UsersRepositoryInterface } from '../../../users/interfaces/users.repository.interface';
import { LikesRepositoryInterface } from '../../../likes/interfaces/likes.repository.interface';
import { InjectThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageService } from '../../../../shared/throttler/application/throttler.storage.service';
import { InjectUsersRepository } from '../../../users/infrastructure/providers/users-repository.provider';
import { InjectBlogsRepository } from '../../../blogs/infrastructure/providers/blogs-repository.provider';
import { InjectCommentsRepository } from '../../../comments/infrastructure/providers/comments-repository.provider';
import { InjectLikesRepository } from '../../../likes/infrastructure/providers/likes-repository.provider';
import { InjectPostsRepository } from '../../../posts/infrastructure/providers/posts-repository.provider';
import { InjectSessionsRepository } from '../../../session/infrastructure/providers/sessions-repository.provider';

export class RemoveAllTestingCommand implements ICommand {}

@CommandHandler(RemoveAllTestingCommand)
export class RemoveAllTestingHandler implements ICommandHandler<RemoveAllTestingCommand> {
	constructor(
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		@InjectPostsRepository() private readonly postsRepository: PostsRepositoryInterface,
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
		@InjectCommentsRepository() private readonly commentsRepository: CommentsRepositoryInterface,
		@InjectSessionsRepository() private readonly sessionRepository: SessionsRepositoryInterface,
		@InjectLikesRepository() private readonly likesRepository: LikesRepositoryInterface,
		@InjectThrottlerStorage() private storage: ThrottlerStorageService,
	) {}

	async execute(): Promise<void> {
		this.storage.clearStorage();
		await this.blogsRepository.deleteAll();
		await this.blogsRepository.deleteAllBan();
		await this.postsRepository.deleteAll();
		await this.usersRepository.deleteAll();
		await this.commentsRepository.deleteAll();
		await this.sessionRepository.deleteAll();
		await this.likesRepository.deleteAll();
	}
}
