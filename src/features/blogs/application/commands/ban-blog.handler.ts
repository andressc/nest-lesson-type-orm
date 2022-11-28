import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { BlogModel } from '../../entity/blog.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { Inject } from '@nestjs/common';
import { BlogInjectionToken } from '../blog.injection.token';
import { BanBlogDto } from '../../dto/ban-blog.dto';

export class BanBlogCommand {
	constructor(public id: string, public data: BanBlogDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
	constructor(
		@Inject(BlogInjectionToken.BLOG_REPOSITORY)
		private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly blogsService: BlogsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: BanBlogCommand): Promise<void> {
		let banDate = null;

		await this.validationService.validate(command.data, BanBlogDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.id);

		if (command.data.isBanned) banDate = new Date().toISOString();

		blog.ban(command.data.isBanned, banDate);
		await this.blogsRepository.save(blog);
	}
}
