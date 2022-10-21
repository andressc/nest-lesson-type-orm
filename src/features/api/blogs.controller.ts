import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
	Put,
	UseGuards,
	Query,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/blogs/create-blog.dto';
import { UpdateBlogDto } from '../dto/blogs/update-blog.dto';
import { BlogsService } from '../application/blogs.service';
import { QueryBlogsRepository } from './query/query-blogs.repository';
import { ObjectIdDto } from '../../common/dto/object-id.dto';
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard';
import { QueryBlogDto } from '../dto/blogs/query-blog.dto';
import { QueryPostsRepository } from './query/query-posts.repository';
import { QueryPostDto } from '../dto/posts/query-post.dto';
import { PostsService } from '../application/posts.service';
import { CreatePostOfBlogDto } from '../dto/posts/create-post-of-blog.dto';

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
	async createPostOfBlog(@Body() data: CreatePostOfBlogDto, @Param() param: ObjectIdDto) {
		const postId = await this.postsService.createPostOfBlog(data, param.id);
		return this.queryPostRepository.findOnePost(postId);
	}

	@Get()
	findAllBlogs(@Query() query: QueryBlogDto) {
		return this.queryBlogRepository.findAllBlogs(query);
	}

	@Get(':id/posts')
	findAllPostsOfBlog(@Query() query: QueryPostDto, @Param() param: ObjectIdDto) {
		return this.queryPostRepository.findAllPosts(query, param.id);
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
