import { ResponseBlogDto } from '../../../dto/blogs';
import { BlogModel } from '../../../../database/entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogNotFoundException } from '../../../../common/exceptions';
import { QueryBlogsRepository } from '../../../infrastructure/query/query-blogs.repository';

export class FindOneBlogCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindOneBlogCommand)
export class FindOneBlogHandler implements IQueryHandler<FindOneBlogCommand> {
	constructor(private readonly queryBlogsRepository: QueryBlogsRepository) {}

	async execute(command: FindOneBlogCommand): Promise<ResponseBlogDto> {
		const blog: BlogModel | null = await this.queryBlogsRepository.findBlogModel(command.id);
		if (!blog) throw new BlogNotFoundException(command.id);

		return {
			id: blog._id,
			youtubeUrl: blog.youtubeUrl,
			name: blog.name,
			createdAt: blog.createdAt,
		};
	}
}
