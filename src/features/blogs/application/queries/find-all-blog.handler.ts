import { QueryBlogDto, ResponseBlogDto } from '../../dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { BlogModel } from '../../domain/blog.schema';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { InjectQueryBlogsRepository } from '../../infrastructure/providers/query-blogs-repository.provider';

export class FindAllBlogCommand {
	constructor(public query: QueryBlogDto, public currentUserId?: string) {}
}

@QueryHandler(FindAllBlogCommand)
export class FindAllBlogHandler implements IQueryHandler<FindAllBlogCommand> {
	constructor(
		@InjectQueryBlogsRepository()
		private readonly queryBlogsRepository: QueryBlogsRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(command: FindAllBlogCommand): Promise<PaginationDto<ResponseBlogDto[]>> {
		const blogCurrentUser = command.currentUserId
			? { userId: command.currentUserId, isBanned: false }
			: { isBanned: false };

		const searchString = command.query.searchNameTerm
			? {
					name: {
						$regex: command.query.searchNameTerm,
						$options: 'i',
					},
					...blogCurrentUser,
			  }
			: blogCurrentUser;

		const totalCount: number = await this.queryBlogsRepository.count(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const blog: BlogModel[] = await this.queryBlogsRepository.findQuery(
			searchString,
			paginationData.sortBy,
			paginationData.skip,
			paginationData.pageSize,
		);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: blog.map((v: BlogModel) => ({
				id: v._id.toString(),
				name: v.name,
				description: v.description,
				websiteUrl: v.websiteUrl,
				createdAt: v.createdAt,
			})),
		};
	}
}
