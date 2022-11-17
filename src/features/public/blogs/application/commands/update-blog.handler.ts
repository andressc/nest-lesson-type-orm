import { UpdateBlogDto } from '../../dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { BlogModel } from '../../entity/blog.schema';
import { ValidationService } from '../../../../../shared/validation/application/validation.service';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { Inject } from '@nestjs/common';
import { BlogInjectionToken } from '../blog.injection.token';

export class UpdateBlogCommand {
	constructor(public id: string, public data: UpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
	constructor(
		@Inject(BlogInjectionToken.BLOG_REPOSITORY)
		private readonly blogsRepository: BlogsRepositoryInterface,
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
