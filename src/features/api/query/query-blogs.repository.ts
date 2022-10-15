import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseBlogDto } from '../../dto/blogs/response-blog.dto';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { BlogNotFoundException } from '../../../common/exceptions/BlogNotFoundException';
import { PaginationCalc, PaginationDto } from '../../dto/general/pagination.dto';
import { PaginationService } from '../../application/pagination.service';
import { QueryBlogDto } from '../../dto/blogs/query-blog.dto';

@Injectable()
export class QueryBlogsRepository {
	constructor(
		@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>,
		private readonly paginationService: PaginationService,
	) {}

	async findAllBlogs(query: QueryBlogDto): Promise<PaginationDto<ResponseBlogDto[]>> {
		const searchString = query.searchNameTerm ? { name: { $regex: query.searchNameTerm } } : {};

		const totalCount: number = await this.blogModel.countDocuments(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...query,
			totalCount,
		});

		const blog: BlogModel[] = await this.blogModel
			.find(searchString)
			.sort(paginationData.sortBy)
			.skip(paginationData.skip)
			.limit(paginationData.pageSize);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: this.mapBlogs(blog),
		};
	}

	async findOneBlog(id: string): Promise<ResponseBlogDto> {
		const blog: BlogModel | null = await this.blogModel.findById(id);
		if (!blog) throw new BlogNotFoundException(id);

		return {
			id: blog._id,
			youtubeUrl: blog.youtubeUrl,
			name: blog.name,
			createdAt: blog.createdAt,
		};
	}

	private mapBlogs(blog: BlogModel[]) {
		return blog.map((v: BlogModel) => ({
			id: v._id.toString(),
			youtubeUrl: v.youtubeUrl,
			name: v.name,
			createdAt: v.createdAt,
		}));
	}
}
