import { createDate } from '../../../../common/helpers';
import { PostsRepository } from '../../infrastructure/repository/posts.repository';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostOfBlogDto } from '../../dto';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { BlogModel } from '../../../blogs/entity/blog.schema';
import { ValidationService } from '../../../application/validation.service';

export class CreatePostOfBlogCommand implements ICommand {
	constructor(public data: CreatePostOfBlogDto, public blogId: string) {}
}

@CommandHandler(CreatePostOfBlogCommand)
export class CreatePostOfBlogHandler implements ICommandHandler<CreatePostOfBlogCommand> {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsRepository: PostsRepository,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreatePostOfBlogCommand): Promise<string> {
		await this.validationService.validate(command.data, CreatePostOfBlogDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.blogId);

		const newPost = await this.postsRepository.createPostModel({
			...command.data,
			blogId: command.blogId,
			blogName: blog.name,
			createdAt: createDate(),
		});

		const result = await this.postsRepository.save(newPost);
		return result.id.toString();
	}
}
