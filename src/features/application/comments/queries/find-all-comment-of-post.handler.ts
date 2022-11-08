import { CommentModel, PostModel } from '../../../../database/entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectIdDto, PaginationCalc, PaginationDto } from '../../../../common/dto';
import { PaginationService } from '../../pagination.service';
import { PostNotFoundException } from '../../../../common/exceptions';
import { QueryCommentsRepository, QueryPostsRepository } from '../../../infrastructure/query';
import { QueryCommentDto, ResponseCommentDto } from '../../../dto/comments';

export class FindAllCommentOfPostCommand {
	constructor(
		public query: QueryCommentDto,
		public postId: string,
		public currentUserId: ObjectIdDto | null,
	) {}
}

@QueryHandler(FindAllCommentOfPostCommand)
export class FindAllCommentOfPostHandler implements IQueryHandler<FindAllCommentOfPostCommand> {
	constructor(
		private readonly queryCommentsRepository: QueryCommentsRepository,
		private readonly queryPostsRepository: QueryPostsRepository,
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
