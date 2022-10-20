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
import { ObjectIdDto } from '../../common/dto/object-id.dto';
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from '../dto/posts/update-post.dto';
import { QueryPostsRepository } from './query/query-posts.repository';
import { QueryPostDto } from '../dto/posts/query-post.dto';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly queryPostRepository: QueryPostsRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createPost(@Body() data: CreatePostDto) {
		const postId = await this.postsService.createPost(data);
		return this.queryPostRepository.findOnePost(postId);
	}

	@Get()
	findAllPosts(@Query() query: QueryPostDto) {
		return this.queryPostRepository.findAllPosts(query);
	}

	@Get(':id')
	findOnePost(@Param() param: ObjectIdDto) {
		return this.queryPostRepository.findOnePost(param.id);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Put(':id')
	async updatePost(@Param() param: ObjectIdDto, @Body() data: UpdatePostDto) {
		await this.postsService.updatePost(param.id, data);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async remove(@Param() param: ObjectIdDto) {
		await this.postsService.removePost(param.id);
	}
}
