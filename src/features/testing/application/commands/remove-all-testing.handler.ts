import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repository';
import { BlogsRepository } from '../../../blogs/infrastructure/repository/blogs.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { CommentsRepository } from '../../../comments/infrastructure/repository/comments.repository';
import { SessionsRepository } from '../../../session/infrastructure/repository/sessions.repository';

export class RemoveAllTestingCommand implements ICommand {}

@CommandHandler(RemoveAllTestingCommand)
export class RemoveAllTestingHandler implements ICommandHandler<RemoveAllTestingCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly postsRepository: PostsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly commentsRepository: CommentsRepository,
		private readonly sessionRepository: SessionsRepository,
	) {}

	async execute(): Promise<void> {
		await this.blogsRepository.deleteAll();
		await this.postsRepository.deleteAll();
		await this.usersRepository.deleteAll();
		await this.commentsRepository.deleteAll();
		await this.sessionRepository.deleteAll();
	}
}
