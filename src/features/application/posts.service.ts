import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/repository/posts.repository';
import { PostModel } from '../../database/entity/post.schema';
import { ValidationService } from './validation.service';
import { CreatePostDto, UpdatePostDto, CreatePostOfBlogDto } from '../dto/posts';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { BlogModel } from '../../database/entity/blog.schema';
import { BlogNotFoundException, PostNotFoundException } from '../../common/exceptions';
import { createDate } from '../../common/helpers';
import { CreateLikeDto } from '../dto/comments';
import { UserModel } from '../../database/entity/user.schema';
import { UserNotFoundException } from '../../common/exceptions';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';

@Injectable()
export class PostsService {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly postsRepository: PostsRepository,
		private readonly validationService: ValidationService,
	) {}

	async createPost(data: CreatePostDto): Promise<string> {
		await this.validationService.validate(data, CreatePostDto);

		const blog: BlogModel = await this.findBlogOrErrorThrow(data.blogId);

		const newPost = await this.postsRepository.createPost({
			...data,
			blogName: blog.name,
			createdAt: createDate(),
		});

		const result = await newPost.save();
		return result.id.toString();
	}

	async createPostOfBlog(data: CreatePostOfBlogDto, blogId: string): Promise<string> {
		await this.validationService.validate(data, CreatePostOfBlogDto);

		const blog: BlogModel = await this.findBlogOrErrorThrow(blogId);

		const newPost = await this.postsRepository.createPost({
			...data,
			blogId,
			blogName: blog.name,
			createdAt: createDate(),
		});

		const result = await newPost.save();
		return result.id.toString();
	}

	async updatePost(id: string, data: UpdatePostDto): Promise<void> {
		await this.validationService.validate(data, UpdatePostDto);

		const blog: BlogModel = await this.findBlogOrErrorThrow(data.blogId);

		const post: PostModel = await this.findPostOrErrorThrow(id);
		post.updateData({ ...data, blogName: blog.name });
		await post.save();
	}

	async removePost(id: string): Promise<void> {
		const post: PostModel = await this.findPostOrErrorThrow(id);
		await post.delete();
	}

	async setLike(commentId: string, authUserId: string, data: CreateLikeDto): Promise<void> {
		await this.validationService.validate(data, CreateLikeDto);

		const user = await this.findUserOrErrorThrow(authUserId);

		const post: PostModel = await this.findPostOrErrorThrow(commentId);

		await post.setLike(data, authUserId, user.login);
		await post.save();
	}

	private async findUserOrErrorThrow(id: string): Promise<UserModel> {
		const user: UserModel = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	private async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}

	private async findBlogOrErrorThrow(id: string): Promise<BlogModel> {
		const blog: BlogModel = await this.blogsRepository.findBlogModel(id);
		if (!blog) throw new BlogNotFoundException(id);
		return blog;
	}
}
