import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { QueryCommentDto } from '../../dto';
import { CommentModel } from '../../domain/comment.schema';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { QueryCommentsRepositoryInterface } from '../../interfaces/query.comments.repository.interface';
import { QueryPostsRepositoryInterface } from '../../../posts/interfaces/query.posts.repository.interface';
import { ResponseCommentOfPostsDto } from '../../dto/response-comment-of-posts.dto';
import { InjectQueryCommentsRepository } from '../../infrastructure/providers/query-comments-repository.provider';
import { InjectQueryPostsRepository } from '../../../posts/infrastructure/providers/query-posts-repository.provider';

export class FindAllCommentOfBlogsCommand {
	constructor(public query: QueryCommentDto, public currentUserId: string | null) {}
}

@QueryHandler(FindAllCommentOfBlogsCommand)
export class FindAllCommentOfBlogsHandler implements IQueryHandler<FindAllCommentOfBlogsCommand> {
	constructor(
		@InjectQueryCommentsRepository()
		private readonly queryCommentsRepository: QueryCommentsRepositoryInterface,
		@InjectQueryPostsRepository()
		private readonly queryPostsRepository: QueryPostsRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(
		command: FindAllCommentOfBlogsCommand,
	): Promise<PaginationDto<ResponseCommentOfPostsDto[]>> {
		const searchString = { blogUserId: command.currentUserId };

		const totalCount: number = await this.queryCommentsRepository.count(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const comments: CommentModel[] = await this.queryCommentsRepository.findQuery(
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
			items: comments.map((v: CommentModel) => {
				likesInfo = this.queryCommentsRepository.countLikes(v, command.currentUserId);

				return {
					id: v._id.toString(),
					content: v.content,
					createdAt: v.createdAt,
					likesInfo: likesInfo,
					commentatorInfo: {
						userId: v.userId,
						userLogin: v.userLogin,
					},
					postInfo: {
						id: v.postId,
						title: v.postTitle,
						blogId: v.blogId,
						blogName: v.blogName,
					},
				};
			}),
		};
	}
}
