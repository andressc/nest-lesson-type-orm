import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { BlogModel } from '../../domain/blog.schema';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../../users/application/users.service';
import { UserModel } from '../../../users/domain/user.schema';
import { InjectBlogsRepository } from '../../infrastructure/providers/blogs-repository.provider';

export class BindBlogWithUserCommand {
	constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserHandler implements ICommandHandler<BindBlogWithUserCommand> {
	constructor(
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly blogsService: BlogsService,
		private readonly usersService: UsersService,
	) {}

	async execute(command: BindBlogWithUserCommand): Promise<void> {
		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.blogId);
		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.userId);

		if (blog.userId) throw new BadRequestException();

		blog.bindBlogWithUser(command.userId, user.login);
		await this.blogsRepository.save(blog);
	}
}
