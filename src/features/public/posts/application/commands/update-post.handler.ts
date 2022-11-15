import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto';
import { PostsService } from '../posts.service';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { BlogModel } from '../../../blogs/entity/blog.schema';
import { PostModel } from '../../entity/post.schema';
import { ValidationService } from '../../../../../shared/validation/application/validation.service';
import { PostsRepositoryAdapter } from '../../adapters/posts.repository.adapter';

export class UpdatePostCommand {
	constructor(public id: string, public data: UpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepositoryAdapter,
		private readonly blogsService: BlogsService,
		private readonly postsService: PostsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: UpdatePostCommand): Promise<void> {
		await this.validationService.validate(command.data, UpdatePostDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.data.blogId);

		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.id);
		post.updateData({
			...command.data,
			blogName: blog.name,
		});
		await this.postsRepository.save(post);
	}
}
