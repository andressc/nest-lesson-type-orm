import { BlogModel, PostModel } from '../../../../database/entity';
import { PostsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../../dto/posts';
import { PostsService } from '../posts.service';
import { BlogsService } from '../../blogs/blogs.service';

export class UpdatePostCommand {
	constructor(public id: string, public data: UpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
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
