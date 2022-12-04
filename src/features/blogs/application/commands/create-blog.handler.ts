import { CreateBlogDto } from '../../dto';
import { BlogModel } from '../../domain/blog.schema';
import { createDate } from '../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { InjectBlogsRepository } from '../../infrastructure/providers/blogs-repository.provider';

export class CreateBlogCommand implements ICommand {
	constructor(
		public data: CreateBlogDto,
		public currentUserId: string,
		public currentUserLogin: string,
	) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
	constructor(
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateBlogCommand): Promise<string> {
		await this.validationService.validate(command.data, CreateBlogDto);

		const newBlog: BlogModel = await this.blogsRepository.create({
			...command.data,
			userId: command.currentUserId,
			userLogin: command.currentUserLogin,
			createdAt: createDate(),
		});
		const result: BlogModel = await this.blogsRepository.save(newBlog);
		return result.id.toString();
	}
}
