import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LikesInfo, LikeStatusEnum } from '../../../../../common/dto';
import { Comment, CommentModel } from '../../entity/comment.schema';
import { QueryCommentsRepositoryAdapter } from '../../adapters/query.comments.repository.adapter';
import { ObjectId } from 'mongodb';
import { LikeDbDto } from '../../../likes/dto/like-db.dto';

@Injectable()
export class QueryCommentsRepository implements QueryCommentsRepositoryAdapter {
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentModel>,
	) {}
	//edvssvd
	async findCommentModel(id: ObjectId): Promise<CommentModel[] | null> {
		return this.commentModel.aggregate([
			{ $match: { _id: id, isBanned: false } },
			{
				$graphLookup: {
					from: 'likes',
					startWith: '$_id',
					connectFromField: '_id',
					connectToField: 'itemId',
					as: 'likes',
				},
			},
		]);
	}

	async findCommentQueryModel(
		searchString: any,
		sortBy: any,
		skip: number,
		pageSize: number,
	): Promise<CommentModel[] | null> {
		return this.commentModel
			.aggregate([
				{ $match: { ...searchString, isBanned: false } },
				{
					$graphLookup: {
						from: 'likes',
						startWith: '$_id',
						connectFromField: '_id',
						connectToField: 'itemId',
						as: 'likes',
					},
				},
			])
			.sort(sortBy)
			.skip(skip)
			.limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.commentModel.countDocuments({ ...searchString, isBanned: false });
	}

	public countLikes(comment: CommentModel, currentUserId: string | null): LikesInfo {
		const likesCount = comment.likes.filter(
			(v: LikeDbDto) => v.likeStatus === LikeStatusEnum.Like && !v.isBanned,
		).length;

		const dislikesCount = comment.likes.filter(
			(v: LikeDbDto) => v.likeStatus === LikeStatusEnum.Dislike && !v.isBanned,
		).length;

		let myStatus = LikeStatusEnum.None;

		comment.likes.forEach((it: LikeDbDto) => {
			if (currentUserId && new ObjectId(it.userId).equals(currentUserId)) myStatus = it.likeStatus;
		});

		return {
			likesCount,
			dislikesCount,
			myStatus,
		};
	}
}
