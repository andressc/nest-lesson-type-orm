import { PostModel } from '../../entity/post.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import { PostsRepositoryInterface } from '../../interface/posts.repository.interface';

export class RemovePostCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemovePostCommand)
export class RemovePostHandler implements ICommandHandler<RemovePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepositoryInterface,
		private readonly postsService: PostsService,
	) {}

	async execute(command: RemovePostCommand): Promise<void> {
		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.id);
		await post.delete();
	}
}
