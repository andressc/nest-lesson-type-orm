import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponsePostDto } from '../../dto/posts/response-post.dto';
import { Post, PostModel } from '../../../entity/post.schema';
import { PostNotFoundException } from '../../../common/exceptions/PostNotFoundException';
import { PaginationCalc, PaginationDto } from '../../dto/general/pagination.dto';
import { QueryDto } from '../../dto/general/query.dto';
import { PaginationService } from '../../application/pagination.service';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { BlogNotFoundException } from '../../../common/exceptions/BlogNotFoundException';

@Injectable()
export class QueryPostsRepository {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<PostModel>,
		@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>,
		private readonly paginationService: PaginationService,
	) {}

	async findAllPosts(query: QueryDto, blogId?: string): Promise<PaginationDto<ResponsePostDto[]>> {
		const searchString = blogId ? { blogId } : {};

		const blog: BlogModel | null = blogId ? await this.blogModel.findById(blogId) : null;
		if (!blog) throw new BlogNotFoundException(blogId);

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
			items: this.mapPosts(post),
		};
	}

	async findOnePost(id: string): Promise<ResponsePostDto> {
		const post: PostModel | null = await this.postModel.findById(id);
		if (!post) throw new PostNotFoundException(id);

		return {
			id: post.id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			blogId: post.blogId,
			blogName: post.blogName,
			createdAt: post.createdAt,
		};
	}

	private mapPosts(post: PostModel[]) {
		return post.map((v: PostModel) => ({
			id: v._id.toString(),
			title: v.title,
			shortDescription: v.shortDescription,
			content: v.content,
			blogId: v.blogId,
			blogName: v.blogName,
			createdAt: v.createdAt,
		}));
	}
}
