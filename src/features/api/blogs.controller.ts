import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';

import { BlogsService, PostsService } from '../application';
import { QueryBlogsRepository, QueryPostsRepository } from './query';
import { ObjectIdDto } from '../../common/dto';
import { BasicAuthGuard, GuestGuard } from '../../common/guards';
import { QueryBlogDto, UpdateBlogDto, CreateBlogDto } from '../dto/blogs';
import { CreatePostOfBlogDto, QueryPostDto } from '../dto/posts';
import { CurrentUserIdNonAuthorized } from '../../common/decorators/Param';

@Controller('blogs')
export class BlogsController {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsService: PostsService,
		private readonly queryBlogRepository: QueryBlogsRepository,
		private readonly queryPostRepository: QueryPostsRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createBlog(@Body() data: CreateBlogDto) {
		const blogId = await this.blogsService.createBlog(data);
		return this.queryBlogRepository.findOneBlog(blogId);
	}

	@UseGuards(BasicAuthGuard)
	@Post(':id/posts')
	async createPostOfBlog(
		@Body() data: CreatePostOfBlogDto,
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized() currentUserId,
	) {
		const postId = await this.postsService.createPostOfBlog(data, param.id);
		return this.queryPostRepository.findOnePost(postId, currentUserId);
	}

	@Get()
	findAllBlogs(@Query() query: QueryBlogDto) {
		return this.queryBlogRepository.findAllBlogs(query);
	}

	@Get(':id/posts')
	@UseGuards(GuestGuard)
	findAllPostsOfBlog(
		@Query() query: QueryPostDto,
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized() currentUserId,
	) {
		return this.queryPostRepository.findAllPosts(query, currentUserId, param.id);
	}

	@Get(':id')
	findOneBlog(@Param() param: ObjectIdDto) {
		return this.queryBlogRepository.findOneBlog(param.id);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Put(':id')
	async updateBlog(@Param() param: ObjectIdDto, @Body() data: UpdateBlogDto) {
		await this.blogsService.updateBlog(param.id, data);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async removeBlog(@Param() param: ObjectIdDto) {
		await this.blogsService.removeBlog(param.id);
	}
}
