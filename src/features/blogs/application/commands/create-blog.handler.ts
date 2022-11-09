import { CreateBlogDto } from '../../dto';
import { BlogModel } from '../../entity/blog.schema';
import { createDate } from '../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/repository/blogs.repository';
import { ValidationService } from '../../../application/validation.service';

export class CreateBlogCommand implements ICommand {
	constructor(public data: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateBlogCommand): Promise<string> {
		await this.validationService.validate(command.data, CreateBlogDto);

		const newBlog: BlogModel = await this.blogsRepository.createBlogModel({
			...command.data,
			createdAt: createDate(),
		});
		const result: BlogModel = await this.blogsRepository.save(newBlog);
		return result.id.toString();
	}
}
