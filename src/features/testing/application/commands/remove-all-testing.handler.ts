import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryInterface } from '../../../blogs/interface/blogs.repository.interface';
import { CommentsRepositoryInterface } from '../../../comments/interface/comments.repository.interface';
import { PostsRepositoryInterface } from '../../../posts/interface/posts.repository.interface';
import { SessionsRepositoryInterface } from '../../../session/interface/sessions.repository.interface';
import { UsersRepositoryInterface } from '../../../users/interface/users.repository.interface';

export class RemoveAllTestingCommand implements ICommand {}

@CommandHandler(RemoveAllTestingCommand)
export class RemoveAllTestingHandler implements ICommandHandler<RemoveAllTestingCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly postsRepository: PostsRepositoryInterface,
		private readonly usersRepository: UsersRepositoryInterface,
		private readonly commentsRepository: CommentsRepositoryInterface,
		private readonly sessionRepository: SessionsRepositoryInterface,
	) {}

	async execute(): Promise<void> {
		await this.blogsRepository.deleteAll();
		await this.postsRepository.deleteAll();
		await this.usersRepository.deleteAll();
		await this.commentsRepository.deleteAll();
		await this.sessionRepository.deleteAll();
	}
}
