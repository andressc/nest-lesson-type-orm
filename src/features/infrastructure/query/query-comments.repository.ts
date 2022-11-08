import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel, Post, PostModel } from '../../../database/entity';
import { LikesDto, LikesInfo, LikeStatusEnum, ObjectIdDto, Sort } from '../../../common/dto';

@Injectable()
export class QueryCommentsRepository {
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentModel>,
		@InjectModel(Post.name)
		private readonly postModel: Model<PostModel>,
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

	public countLikes(comment: CommentModel, currentUserId: ObjectIdDto | null): LikesInfo {
		let myStatus = LikeStatusEnum.None;

		const likesCount = comment.likes.filter((u) => u.likeStatus === LikeStatusEnum.Like).length;
		const dislikesCount = comment.likes.filter(
			(u) => u.likeStatus === LikeStatusEnum.Dislike,
		).length;

		const findMyStatus: undefined | LikesDto = comment.likes.find(
			(v) => v.userId === currentUserId.id,
		);

		if (findMyStatus) myStatus = findMyStatus.likeStatus;

		return {
			likesCount,
			dislikesCount,
			myStatus,
		};
	}
}
