import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { PostNotFoundException } from '../../../../common/exceptions';
import { QueryCommentDto, ResponseCommentDto } from '../../dto';
import { PostModel } from '../../../posts/entity/post.schema';
import { CommentModel } from '../../entity/comment.schema';
import { PaginationService } from '../../../application/pagination.service';
import { QueryCommentsRepositoryInterface } from '../../interface/query.comments.repository.interface';
import { QueryPostsRepositoryInterface } from '../../../posts/interface/query.posts.repository.interface';

export class FindAllCommentOfPostCommand {
	constructor(
		public query: QueryCommentDto,
		public postId: string,
		public currentUserId: string | null,
	) {}
}

@QueryHandler(FindAllCommentOfPostCommand)
export class FindAllCommentOfPostHandler implements IQueryHandler<FindAllCommentOfPostCommand> {
	constructor(
		private readonly queryCommentsRepository: QueryCommentsRepositoryInterface,
		private readonly queryPostsRepository: QueryPostsRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(
		command: FindAllCommentOfPostCommand,
	): Promise<PaginationDto<ResponseCommentDto[]>> {
		const searchString = { postId: command.postId };

		const post: PostModel | null = await this.queryPostsRepository.findPostModel(command.postId);
		if (!post) throw new PostNotFoundException(command.postId);

		const totalCount: number = await this.queryCommentsRepository.count(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const comments: CommentModel[] = await this.queryCommentsRepository.findCommentQueryModel(
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
					userId: v.userId,
					userLogin: v.userLogin,
					createdAt: v.createdAt,
					likesInfo,
				};
			}),
		};
	}
}
