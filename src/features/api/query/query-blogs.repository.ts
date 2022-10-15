import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueryBlogDto } from '../../dto/blogs/query-blog.dto';
import { Blog, BlogModel } from '../../../entity/blog.schema';
import { BlogNotFoundException } from '../../../common/exceptions/BlogNotFoundException';

@Injectable()
export class QueryBlogsRepository {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

	async findAllBlogs(): Promise<QueryBlogDto[]> {
		const blog: BlogModel[] = await this.blogModel.find();
		return this.mapBlogs(blog);
	}

	async findOneBlog(id: string): Promise<QueryBlogDto> {
		const blog: BlogModel | null = await this.blogModel.findById(id);
		if (!blog) throw new BlogNotFoundException(id);

		return {
			id: blog._id,
			youtubeUrl: blog.youtubeUrl,
			createdAt: blog.createdAt,
			name: blog.name,
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
