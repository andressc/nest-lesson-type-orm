import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LikesDto, LikesInfo, LikeStatusEnum, Sort } from '../../../../common/dto';
import { Comment, CommentModel } from '../../entity/comment.schema';
import { QueryCommentsRepositoryInterface } from '../../interface/query.comments.repository.interface';

@Injectable()
export class QueryCommentsRepository implements QueryCommentsRepositoryInterface {
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentModel>,
	) {}

	async findCommentModel(id: string): Promise<CommentModel | null> {
		return this.commentModel.findById(id);
	}

	async findCommentQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<CommentModel[] | null> {
		return this.commentModel.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.commentModel.countDocuments(searchString);
	}

	public countLikes(comment: CommentModel, currentUserId: string | null): LikesInfo {
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
