import { CreateBlogDto } from '../../../dto/blogs';
import { BlogModel } from '../../../../database/entity';
import { createDate } from '../../../../common/helpers';
import { BlogsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

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
