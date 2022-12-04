import { ResponseBlogDto } from '../../dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogNotFoundException } from '../../../../common/exceptions';
import { BlogModel } from '../../domain/blog.schema';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { ObjectId } from 'mongodb';
import { InjectQueryBlogsRepository } from '../../infrastructure/providers/query-blogs-repository.provider';

export class FindOneBlogCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindOneBlogCommand)
export class FindOneBlogHandler implements IQueryHandler<FindOneBlogCommand> {
	constructor(
		@InjectQueryBlogsRepository()
		private readonly queryBlogsRepository: QueryBlogsRepositoryInterface,
	) {}

	async execute(command: FindOneBlogCommand): Promise<ResponseBlogDto> {
		const blog: BlogModel | null = await this.queryBlogsRepository.find(new ObjectId(command.id));
		if (!blog) throw new BlogNotFoundException(command.id);
		if (blog.isBanned) throw new BlogNotFoundException(command.id);

		return {
			id: blog._id,
			name: blog.name,
			description: blog.description,
			websiteUrl: blog.websiteUrl,
			createdAt: blog.createdAt,
		};
	}
}
