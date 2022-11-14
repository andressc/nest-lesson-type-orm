import { QueryBlogDto, ResponseBlogDto } from '../../dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { BlogModel } from '../../entity/blog.schema';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { QueryBlogsRepositoryAdapter } from '../../adapters/query.blogs.repository.adapter';

export class FindAllBlogCommand {
	constructor(public query: QueryBlogDto) {}
}

@QueryHandler(FindAllBlogCommand)
export class FindAllBlogHandler implements IQueryHandler<FindAllBlogCommand> {
	constructor(
		private readonly queryBlogsRepository: QueryBlogsRepositoryAdapter,
		private readonly paginationService: PaginationService,
	) {}

	async execute(command: FindAllBlogCommand): Promise<PaginationDto<ResponseBlogDto[]>> {
		const searchString = command.query.searchNameTerm
			? {
					name: {
						$regex: command.query.searchNameTerm,
						$options: 'i',
					},
			  }
			: {};

		const totalCount: number = await this.queryBlogsRepository.count(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const blog: BlogModel[] = await this.queryBlogsRepository.findBlogQueryModel(
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
				youtubeUrl: v.youtubeUrl,
				name: v.name,
				createdAt: v.createdAt,
			})),
		};
	}
}
