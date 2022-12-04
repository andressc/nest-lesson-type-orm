import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application/users.service';
import { UserModel } from '../../../users/domain/user.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { UsersRepositoryInterface } from '../../../users/interfaces/users.repository.interface';
import { ForbiddenException } from '@nestjs/common';
import { BanUnbanBlogOfUserDto } from '../../dto/ban-unban-blog-of-user.dto';
import { BlogModel } from '../../domain/blog.schema';
import { BlogsService } from '../blogs.service';
import { UserIdBadRequestException } from '../../../../common/exceptions/userIdBadRequestException';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { BanModel } from '../../domain/ban.schema';
import { InjectUsersRepository } from '../../../users/infrastructure/providers/users-repository.provider';
import { InjectBlogsRepository } from '../../infrastructure/providers/blogs-repository.provider';

export class BanUnbanBlogOfUserCommand implements ICommand {
	constructor(
		public userId: string,
		public data: BanUnbanBlogOfUserDto,
		public currentUserId: string,
	) {}
}

@CommandHandler(BanUnbanBlogOfUserCommand)
export class BanUnbanBlogOfUserHandler implements ICommandHandler<BanUnbanBlogOfUserCommand> {
	constructor(
		private readonly usersService: UsersService,
		private readonly blogsService: BlogsService,
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: BanUnbanBlogOfUserCommand): Promise<void> {
		await this.validationService.validate(command.data, BanUnbanBlogOfUserDto);

		let banDate = null;

		const user: UserModel = await this.usersService.findUserByIdOrErrorThrow(command.userId);
		if (user.id === command.currentUserId) throw new UserIdBadRequestException();

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.data.blogId);
		if (blog.userId !== command.currentUserId) throw new ForbiddenException();

		if (command.data.isBanned) banDate = new Date().toISOString();

		const banned: BanModel | null = await this.blogsRepository.findBanByBlogIdAndUserId(
			command.data.blogId,
			command.userId,
		);

		if (!banned) {
			const newBanUser: BanModel = await this.blogsRepository.createBanModel({
				...command.data,
				blogName: blog.name,
				userId: user.id,
				login: user.login,
				banDate,
			});
			await this.blogsRepository.saveBanModel(newBanUser);
		}

		if (banned) {
			banned.banUnbanUser(command.data.isBanned, command.data.banReason, banDate);
			await this.blogsRepository.saveBanModel(banned);
		}
	}
}
