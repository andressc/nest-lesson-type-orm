import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto, QueryDto } from '../../../../common/dto';
import { ResponsePostDto } from '../../dto';
import { PostModel } from '../../domain/post.schema';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { BlogModel } from '../../../blogs/domain/blog.schema';
import { BlogNotFoundException } from '../../../../common/exceptions';
import { QueryBlogsRepositoryInterface } from '../../../blogs/interfaces/query.blogs.repository.interface';
import { QueryPostsRepositoryInterface } from '../../interfaces/query.posts.repository.interface';
import { ObjectId } from 'mongodb';
import { InjectQueryBlogsRepository } from '../../../blogs/infrastructure/providers/query-blogs-repository.provider';
import { InjectQueryPostsRepository } from '../../infrastructure/providers/query-posts-repository.provider';

export class FindAllPostCommand {
	constructor(
		public query: QueryDto,
		public currentUserId: string | null,
		public blogId?: string,
	) {}
}

@QueryHandler(FindAllPostCommand)
export class FindAllPostHandler implements IQueryHandler<FindAllPostCommand> {
	constructor(
		@InjectQueryPostsRepository()
		private readonly queryPostsRepository: QueryPostsRepositoryInterface,
		@InjectQueryBlogsRepository()
		private readonly queryBlogsRepository: QueryBlogsRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(command: FindAllPostCommand): Promise<PaginationDto<ResponsePostDto[]>> {
		const searchString = command.blogId
			? { blogId: command.blogId, isBanned: false }
			: { isBanned: false };

		const blog: BlogModel | null = await this.queryBlogsRepository.find(
			new ObjectId(command.blogId),
		);
		if (!blog && command.blogId) throw new BlogNotFoundException(command.blogId);

		const totalCount: number = await this.queryPostsRepository.count(searchString);

		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const post: PostModel[] = await this.queryPostsRepository.findQuery(
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
