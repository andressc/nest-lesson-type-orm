import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/repository/posts.repository';
import { PostModel } from '../../entity/post.schema';
import { ValidationService } from './validation.service';
import { CreatePostDto, UpdatePostDto, CreatePostOfBlogDto } from '../dto/posts';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { BlogModel } from '../../entity/blog.schema';
import { BlogNotFoundException, PostNotFoundException } from '../../common/exceptions';
import { createDate } from '../../common/helpers';
import { CreateLikeDto } from '../dto/comments';
import { UserModel } from '../../entity/user.schema';
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

	async setLike(commentId: string, authUserId: string, data: CreateLikeDto): Promise<void> {
		await this.validationService.validate(data, CreateLikeDto);

		const userLogin = await this.checkUserExists(authUserId);
		const post: PostModel = await this.checkPostExists(commentId);
		await this.postsRepository.setLike(post, data, authUserId, userLogin);
	}

	private async checkUserExists(id: string): Promise<string> {
		const user: UserModel = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user.login;
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
