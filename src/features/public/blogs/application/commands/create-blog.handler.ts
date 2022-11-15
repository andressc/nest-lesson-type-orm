import { CreateBlogDto, CreateBlogExtendsDto } from '../../dto';
import { BlogModel } from '../../entity/blog.schema';
import { createDate } from '../../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ValidationService } from '../../../../../shared/validation/application/validation.service';
import { BlogsRepositoryAdapter } from '../../adapters/blogs.repository.adapter';

export class CreateBlogCommand implements ICommand {
	constructor(public data: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepositoryAdapter<BlogModel, CreateBlogExtendsDto>,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateBlogCommand): Promise<string> {
		await this.validationService.validate(command.data, CreateBlogDto);

		const newBlog: BlogModel = await this.blogsRepository.create({
			...command.data,
			createdAt: createDate(),
		});
		const result: BlogModel = await this.blogsRepository.save(newBlog);
		return result.id.toString();
	}
}
