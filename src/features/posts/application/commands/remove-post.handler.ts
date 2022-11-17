import { PostModel } from '../../entity/post.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';
import { Inject } from '@nestjs/common';
import { PostInjectionToken } from '../post.injection.token';

export class RemovePostCommand {
	constructor(public id: string) {}
}

@CommandHandler(RemovePostCommand)
export class RemovePostHandler implements ICommandHandler<RemovePostCommand> {
	constructor(
		@Inject(PostInjectionToken.POST_REPOSITORY)
		private readonly postsRepository: PostsRepositoryInterface,
		private readonly postsService: PostsService,
	) {}

	async execute(command: RemovePostCommand): Promise<void> {
		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.id);
		await this.postsRepository.delete(post);
	}
}
