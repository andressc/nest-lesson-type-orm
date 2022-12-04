import { BlogModel } from '../../../blogs/domain/blog.schema';
import { createDate } from '../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../dto';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';
import { InjectPostsRepository } from '../../infrastructure/providers/posts-repository.provider';

export class CreatePostCommand implements ICommand {
	constructor(public data: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
	constructor(
		private readonly blogsService: BlogsService,
		@InjectPostsRepository()
		private readonly postsRepository: PostsRepositoryInterface,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreatePostCommand): Promise<string> {
		await this.validationService.validate(command.data, CreatePostDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.data.blogId);

		const newPost = await this.postsRepository.create({
			...command.data,
			blogName: blog.name,
			blogUserId: blog.userId,
			createdAt: createDate(),
		});

		const result = await this.postsRepository.save(newPost);
		return result.id.toString();
	}
}
