import { BlogModel } from '../../../../database/entity';
import { createDate } from '../../../../common/helpers';
import { PostsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../../dto/posts';
import { BlogsService } from '../../blogs/blogs.service';

export class CreatePostCommand implements ICommand {
	constructor(public data: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsRepository: PostsRepository,
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
