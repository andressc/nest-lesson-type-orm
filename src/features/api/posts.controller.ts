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
import { AccessTokenGuard, BasicAuthGuard } from '../../common/guards';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from '../dto/posts/update-post.dto';
import { QueryPostsRepository } from './query/query-posts.repository';
import { QueryPostDto } from '../dto/posts/query-post.dto';
import { QueryCommentsRepository } from './query/query-comments.repository';
import { QueryCommentDto } from '../dto/comments/query-comment.dto';
import { CommentsService } from '../application/comments.service';
import { CreateCommentOfPostDto } from '../dto/comments/create-comment-of-post.dto';
import { CurrentUserId } from '../../common/decorators';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly commentsService: CommentsService,
		private readonly queryPostRepository: QueryPostsRepository,
		private readonly queryCommentsRepository: QueryCommentsRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createPost(@Body() data: CreatePostDto) {
		const postId = await this.postsService.createPost(data);
		return this.queryPostRepository.findOnePost(postId);
	}

	@UseGuards(AccessTokenGuard)
	@Post(':id/comments')
	async createCommentOfPost(
		@Body() data: CreateCommentOfPostDto,
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
	) {
		const commentId = await this.commentsService.createCommentOfPost(data, param.id, currentUserId);
		return this.queryCommentsRepository.findOneComment(commentId);
	}

	@Get()
	findAllPosts(@Query() query: QueryPostDto) {
		return this.queryPostRepository.findAllPosts(query);
	}

	@Get(':id/comments')
	findAllCommentsOfPost(@Param() param: ObjectIdDto, @Query() query: QueryCommentDto) {
		return this.queryCommentsRepository.findAllCommentsOfPost(query, param.id);
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
	async removePost(@Param() param: ObjectIdDto) {
		await this.postsService.removePost(param.id);
	}
}
