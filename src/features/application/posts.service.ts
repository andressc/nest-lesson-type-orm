import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/repository/posts.repository';
import { PostModel } from '../../entity/post.schema';
import { ValidationService } from './validation.service';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { UpdatePostDto } from '../dto/posts/update-post.dto';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { BlogModel } from '../../entity/blog.schema';
import { BlogNotFoundException } from '../../common/exceptions/BlogNotFoundException';
import { PostNotFoundException } from '../../common/exceptions/PostNotFoundException';
import { createDate } from '../../common/helpers/date.helper';
import { CreatePostOfBlogDto } from '../dto/posts/create-post-of-blog.dto';

@Injectable()
export class PostsService {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly postsRepository: PostsRepository,
		private readonly validationService: ValidationService,
	) {}

	async createPost(data: CreatePostDto): Promise<string> {
		await this.validationService.validate(data, CreatePostDto);

		const blogName: string = await this.blogExists(data.blogId);

		return this.postsRepository.createPost({ ...data, blogName, createdAt: createDate() });
	}

	async createPostOfBlog(data: CreatePostOfBlogDto, blogId: string): Promise<string> {
		await this.validationService.validate(data, CreatePostOfBlogDto);

		const blogName: string = await this.blogExists(blogId);

		return this.postsRepository.createPost({ ...data, blogId, blogName, createdAt: createDate() });
	}

	async updatePost(id: string, data: UpdatePostDto): Promise<void> {
		await this.validationService.validate(data, UpdatePostDto);

		const blogName: string = await this.blogExists(data.blogId);

		const post: PostModel = await this.checkPostExists(id);
		await this.postsRepository.updatePost(post, { ...data, blogName });
	}

	async removePost(id: string): Promise<void> {
		const post: PostModel = await this.checkPostExists(id);
		await this.postsRepository.removePost(post);
	}

	private async checkPostExists(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}

	private async blogExists(id: string): Promise<string> {
		const blog: BlogModel = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog.name;
	}
}
