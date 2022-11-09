import { PostModel } from '../../entity/post.schema';
import { PostsRepository } from '../../infrastructure/repository/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';

export class RemovePostCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemovePostCommand)
export class RemovePostHandler implements ICommandHandler<RemovePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly postsService: PostsService,
	) {}

	async execute(command: RemovePostCommand): Promise<void> {
		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.id);
		await post.delete();
	}
}
