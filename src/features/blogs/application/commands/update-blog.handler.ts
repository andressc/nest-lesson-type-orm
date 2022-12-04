import { UpdateBlogDto } from '../../dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { BlogModel } from '../../domain/blog.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { ForbiddenException } from '@nestjs/common';
import { InjectBlogsRepository } from '../../infrastructure/providers/blogs-repository.provider';

export class UpdateBlogCommand {
	constructor(public id: string, public data: UpdateBlogDto, public currentUserId: string) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
	constructor(
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly blogsService: BlogsService,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: UpdateBlogCommand): Promise<void> {
		await this.validationService.validate(command.data, UpdateBlogDto);

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.id);
		if (blog.userId !== command.currentUserId) throw new ForbiddenException();

		blog.updateData(command.data);
		await this.blogsRepository.save(blog);
	}
}
