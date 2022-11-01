import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponsePostDto } from '../../dto/posts';
import { Post, PostModel } from '../../../entity/post.schema';
import { PostNotFoundException, BlogNotFoundException } from '../../../common/exceptions';
import { PaginationCalc, PaginationDto } from '../../../common/dto/pagination.dto';
import { QueryDto } from '../../../common/dto/query.dto';
import { PaginationService } from '../../application/pagination.service';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { LikeStatusEnum } from '../../../common/dto/like-status.enum';
import { LikesDto } from '../../../common/dto/likes.dto';
import { LikesInfoExtended } from '../../../common/dto/likes-info-extended.dto';
import { ObjectIdDto } from '../../../common/dto/object-id.dto';

@Injectable()
export class QueryPostsRepository {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<PostModel>,
		@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>,
		private readonly paginationService: PaginationService,
	) {}

	async findAllPosts(
		query: QueryDto,
		currentUserId: ObjectIdDto | null,
		blogId?: string,
	): Promise<PaginationDto<ResponsePostDto[]>> {
		const searchString = blogId ? { blogId } : {};

		const blog: BlogModel | null = await this.blogModel.findById(blogId);
		if (!blog && blogId) throw new BlogNotFoundException(blogId);

		const totalCount: number = await this.postModel.countDocuments(searchString);

		const paginationData: PaginationCalc = this.paginationService.pagination({
			...query,
			totalCount,
		});

		const post: PostModel[] = await this.postModel
			.find(searchString)
			.sort(paginationData.sortBy)
			.skip(paginationData.skip)
			.limit(paginationData.pageSize);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: this.mapPosts(post, currentUserId),
		};
	}

	async findOnePost(id: string, currentUserId: ObjectIdDto | null): Promise<ResponsePostDto> {
		const post: PostModel | null = await this.postModel.findById(id);
		if (!post) throw new PostNotFoundException(id);

		const likesInfo = this.countLikes(post, currentUserId);

		return {
			id: post.id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			blogId: post.blogId,
			blogName: post.blogName,
			createdAt: post.createdAt,
			extendedLikesInfo: likesInfo,
		};
	}

	private mapPosts(post: PostModel[], currentUserId: ObjectIdDto | null) {
		let likesInfo;
		return post.map((v: PostModel) => {
			likesInfo = this.countLikes(v, currentUserId);

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
		});
	}

	private countLikes(post: PostModel, currentUserId: ObjectIdDto | null): LikesInfoExtended {
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
