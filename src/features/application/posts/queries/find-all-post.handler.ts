import { BlogModel, PostModel } from '../../../../database/entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectIdDto, PaginationCalc, PaginationDto, QueryDto } from '../../../../common/dto';
import { PaginationService } from '../../pagination.service';
import { QueryBlogsRepository } from '../../../infrastructure/query/query-blogs.repository';
import { ResponsePostDto } from '../../../dto/posts';
import { BlogNotFoundException } from '../../../../common/exceptions';
import { QueryPostsRepository } from '../../../infrastructure/query';

export class FindAllPostCommand {
	constructor(
		public query: QueryDto,
		public currentUserId: ObjectIdDto | null,
		public blogId?: string,
	) {}
}

@QueryHandler(FindAllPostCommand)
export class FindAllPostHandler implements IQueryHandler<FindAllPostCommand> {
	constructor(
		private readonly queryPostsRepository: QueryPostsRepository,
		private readonly queryBlogsRepository: QueryBlogsRepository,
		private readonly paginationService: PaginationService,
	) {}

	async execute(command: FindAllPostCommand): Promise<PaginationDto<ResponsePostDto[]>> {
		const searchString = command.blogId ? { blogId: command.blogId } : {};

		const blog: BlogModel | null = await this.queryBlogsRepository.findBlogModel(command.blogId);
		if (!blog && command.blogId) throw new BlogNotFoundException(command.blogId);

		const totalCount: number = await this.queryPostsRepository.count(searchString);

		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const post: PostModel[] = await this.queryPostsRepository.findPostQueryModel(
			searchString,
			paginationData.sortBy,
			paginationData.skip,
			paginationData.pageSize,
		);

		let likesInfo;
		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: post.map((v: PostModel) => {
				likesInfo = this.queryPostsRepository.countLikes(v, command.currentUserId);

				return {
					id: v._id.toString(),
					title: v.title,
					shortDescription: v.shortDescription,
					content: v.content,
					blogId: v.blogId,
					blogName: v.blogName,
					createdAt: v.createdAt,
					extendedLikesInfo: likesInfo,
				};
			}),
		};
	}
}
