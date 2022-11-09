import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
	LikesInfoExtended,
	LikesDto,
	LikeStatusEnum,
	ObjectIdDto,
	Sort,
} from '../../../../common/dto';
import { Post, PostModel } from '../../entity/post.schema';
import { QueryPostsRepositoryInterface } from '../../interface/query.posts.repository.interface';

@Injectable()
export class QueryPostsRepository implements QueryPostsRepositoryInterface {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<PostModel>,
	) {}

	async findPostModel(id: string): Promise<PostModel | null> {
		return this.postModel.findById(id);
	}

	async findPostQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<PostModel[] | null> {
		return this.postModel.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.postModel.countDocuments(searchString);
	}

	public countLikes(post: PostModel, currentUserId: ObjectIdDto | null): LikesInfoExtended {
		let myStatus = LikeStatusEnum.None;

		const likesCount = post.likes.filter((u) => u.likeStatus === LikeStatusEnum.Like).length;
		const dislikesCount = post.likes.filter((u) => u.likeStatus === LikeStatusEnum.Dislike).length;

		const findMyStatus: undefined | LikesDto = post.likes.find(
			(v) => v.userId === currentUserId.id,
		);

		if (findMyStatus) myStatus = findMyStatus.likeStatus;

		const newestLikes = post.likes
			.slice()
			.filter((v) => v.likeStatus === LikeStatusEnum.Like)
			.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
			.map((v) => ({
				addedAt: v.addedAt,
				userId: v.userId,
				login: v.login,
			}))
			.slice(0, 3);

		return {
			likesCount,
			dislikesCount,
			myStatus,
			newestLikes,
		};
	}
}
