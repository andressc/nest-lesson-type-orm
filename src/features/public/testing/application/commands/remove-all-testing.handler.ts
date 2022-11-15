import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryAdapter } from '../../../blogs/adapters/blogs.repository.adapter';
import { CommentsRepositoryAdapter } from '../../../comments/adapters/comments.repository.adapter';
import { PostsRepositoryAdapter } from '../../../posts/adapters/posts.repository.adapter';
import { SessionsRepositoryAdapter } from '../../../session/adapters/sessions.repository.adapter';
import { UsersRepositoryAdapter } from '../../../../admin/users/adapters/users.repository.adapter';
import { LikesRepositoryAdapter } from '../../../likes/adapters/likes.repository.adapter';
import { InjectThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageService } from '../../../../../shared/throttler/application/throttler.storage.service';
import { BlogModel } from '../../../blogs/entity/blog.schema';

export class RemoveAllTestingCommand implements ICommand {}

@CommandHandler(RemoveAllTestingCommand)
export class RemoveAllTestingHandler implements ICommandHandler<RemoveAllTestingCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepositoryAdapter<BlogModel>,
		private readonly postsRepository: PostsRepositoryAdapter,
		private readonly usersRepository: UsersRepositoryAdapter,
		private readonly commentsRepository: CommentsRepositoryAdapter,
		private readonly sessionRepository: SessionsRepositoryAdapter,
		private readonly likesRepository: LikesRepositoryAdapter,
		@InjectThrottlerStorage() private storage: ThrottlerStorageService,
	) {}

	async execute(): Promise<void> {
		this.storage.clearStorage();
		await this.blogsRepository.deleteAll();
		await this.postsRepository.deleteAll();
		await this.usersRepository.deleteAll();
		await this.commentsRepository.deleteAll();
		await this.sessionRepository.deleteAll();
		await this.likesRepository.deleteAll();
	}
}
