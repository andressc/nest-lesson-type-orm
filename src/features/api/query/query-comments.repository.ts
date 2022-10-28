import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseCommentDto, QueryCommentDto } from '../../dto/comments';
import { PaginationService } from '../../application/pagination.service';
import { CommentNotFoundException, PostNotFoundException } from '../../../common/exceptions';
import { Comment, CommentModel } from '../../../entity/comment.schema';
import { PaginationCalc, PaginationDto } from '../../../common/dto/pagination.dto';
import { Post, PostModel } from '../../../entity/post.schema';
import { LikeStatusEnum } from '../../../common/dto/like-status.enum';
import { LikesDto } from '../../../common/dto/likes.dto';
import { LikesInfo } from '../../../common/dto/likes-info.dto';

@Injectable()
export class QueryCommentsRepository {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<CommentModel>,
		@InjectModel(Post.name) private readonly postModel: Model<PostModel>,
		private readonly paginationService: PaginationService,
	) {}

	async findAllCommentsOfPost(
		query: QueryCommentDto,
		postId: string,
		currentUserId: string | null,
	): Promise<PaginationDto<ResponseCommentDto[]>> {
		const searchString = { postId: postId };

		const post: PostModel | null = await this.postModel.findById(postId);
		if (!post) throw new PostNotFoundException(postId);

		const totalCount: number = await this.commentModel.countDocuments(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...query,
			totalCount,
		});

		const comments: CommentModel[] = await this.commentModel
			.find(searchString)
			.sort(paginationData.sortBy)
			.skip(paginationData.skip)
			.limit(paginationData.pageSize);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: this.mapComments(comments, currentUserId),
		};
	}

	async findOneComment(id: string, currentUserId: string | null): Promise<ResponseCommentDto> {
		const comment: CommentModel | null = await this.commentModel.findById(id);
		if (!comment) throw new CommentNotFoundException(id);

		const likesInfo = this.countLikes(comment, currentUserId);

		return {
			id: comment.id.toString(),
			content: comment.content,
			userId: comment.userId,
			userLogin: comment.userLogin,
			createdAt: comment.createdAt,
			likesInfo,
		};
	}

	private mapComments(comment: CommentModel[], currentUserId: string | null) {
		let likesInfo;
		return comment.map((v: CommentModel) => {
			likesInfo = this.countLikes(v, currentUserId);

			return {
				id: v._id.toString(),
				content: v.content,
				userId: v.userId,
				userLogin: v.userLogin,
				createdAt: v.createdAt,
				likesInfo,
			};
		});
	}

	private countLikes(comment: CommentModel, currentUserId: string | null): LikesInfo {
		let myStatus = LikeStatusEnum.None;

		const likesCount = comment.likes.filter((u) => u.likeStatus === LikeStatusEnum.Like).length;
		const dislikesCount = comment.likes.filter(
			(u) => u.likeStatus === LikeStatusEnum.Dislike,
		).length;

		const findMyStatus: undefined | LikesDto = comment.likes.find(
			(v) => v.userId === currentUserId,
		);

		if (findMyStatus) myStatus = findMyStatus.likeStatus;

		return {
			likesCount,
			dislikesCount,
			myStatus,
		};
	}
}
