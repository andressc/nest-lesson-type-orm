import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';
import { InjectPostsRepository } from '../../infrastructure/providers/posts-repository.provider';

export class BanUnbanPostCommand implements ICommand {
	constructor(public blogId: string, public isBanned: boolean) {}
}

@CommandHandler(BanUnbanPostCommand)
export class BanUnbanPostHandler implements ICommandHandler<BanUnbanPostCommand> {
	constructor(
		@InjectPostsRepository() private readonly postsRepository: PostsRepositoryInterface,
	) {}

	async execute(command: BanUnbanPostCommand): Promise<void> {
		await this.postsRepository.setBan(command.blogId, command.isBanned);
	}
}
