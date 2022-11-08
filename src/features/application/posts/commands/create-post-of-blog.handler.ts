import { BlogModel } from '../../../../database/entity';
import { createDate } from '../../../../common/helpers';
import { PostsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostOfBlogDto } from '../../../dto/posts';
import { BlogsService } from '../../blogs/blogs.service';

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
