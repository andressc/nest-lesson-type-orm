import { UpdateBlogDto } from '../../dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { BlogsRepository } from '../../infrastructure/repository/blogs.repository';
import { BlogModel } from '../../entity/blog.schema';
import { ValidationService } from '../../../application/validation.service';

export class UpdateBlogCommand {
	constructor(public id: string, public data: UpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly blogsService: BlogsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: UpdateBlogCommand): Promise<void> {
		await this.validationService.validate(command.data, UpdateBlogDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.id);
		blog.updateData(command.data);
		await this.blogsRepository.save(blog);
	}
}