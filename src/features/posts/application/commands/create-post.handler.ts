import { BlogModel } from '../../../blogs/entity/blog.schema';
import { createDate } from '../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../dto';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { ValidationService } from '../../../application/validation.service';
import { PostsRepositoryAdapter } from '../../adapters/posts.repository.adapter';

export class CreatePostCommand implements ICommand {
	constructor(public data: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsRepository: PostsRepositoryAdapter,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreatePostCommand): Promise<string> {
		await this.validationService.validate(command.data, CreatePostDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.data.blogId);

		const newPost = await this.postsRepository.createPostModel({
			...command.data,
			blogName: blog.name,
			createdAt: createDate(),
		});

		const result = await this.postsRepository.save(newPost);
		return result.id.toString();
	}
}
