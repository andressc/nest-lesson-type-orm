import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { BlogModel } from '../../../blogs/domain/blog.schema';
import { PostModel } from '../../domain/post.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';
import { ForbiddenException } from '@nestjs/common';
import { UpdatePostOfBlogDto } from '../../dto/update-post-of-blog.dto';
import { InjectPostsRepository } from '../../infrastructure/providers/posts-repository.provider';

export class UpdatePostCommand {
	constructor(
		public blogId: string,
		public postId: string,
		public data: UpdatePostOfBlogDto,
		public currentUserId: string,
	) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
	constructor(
		@InjectPostsRepository() private readonly postsRepository: PostsRepositoryInterface,
		private readonly blogsService: BlogsService,
		private readonly postsService: PostsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: UpdatePostCommand): Promise<void> {
		await this.validationService.validate(command.data, UpdatePostOfBlogDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.blogId);
		if (blog.userId !== command.currentUserId) throw new ForbiddenException();

		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.postId);
		post.updateData(command.data);
		await this.postsRepository.save(post);
	}
}
