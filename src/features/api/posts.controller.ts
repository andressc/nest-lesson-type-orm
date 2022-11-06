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
import { ObjectIdDto } from '../../common/dto';
import { AccessTokenGuard, BasicAuthGuard, GuestGuard } from '../../common/guards';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dto/posts';
import { PostsService, CommentsService } from '../application';
import { QueryPostsRepository, QueryCommentsRepository } from './query';
import { CreateCommentOfPostDto, CreateLikeDto, QueryCommentDto } from '../dto/comments';
import { CurrentUserId, CurrentUserIdNonAuthorized } from '../../common/decorators/Param';

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
	async createPost(
		@Body() data: CreatePostDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		const postId = await this.postsService.createPost(data);
		return this.queryPostRepository.findOnePost(postId, currentUserId);
	}

	@UseGuards(AccessTokenGuard)
	@Post(':id/comments')
	async createCommentOfPost(
		@Body() data: CreateCommentOfPostDto,
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
	) {
		const commentId = await this.commentsService.createCommentOfPost(data, param.id, currentUserId);
		return this.queryCommentsRepository.findOneComment(commentId, currentUserId);
	}

	@Get()
	@UseGuards(GuestGuard)
	findAllPosts(
		@Query() query: QueryPostDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryPostRepository.findAllPosts(query, currentUserId);
	}

	@UseGuards(GuestGuard)
	@Get(':id/comments')
	findAllCommentsOfPost(
		@Param() param: ObjectIdDto,
		@Query() query: QueryCommentDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryCommentsRepository.findAllCommentsOfPost(query, param.id, currentUserId);
	}

	@Get(':id')
	@UseGuards(GuestGuard)
	findOnePost(
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryPostRepository.findOnePost(param.id, currentUserId);
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

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':id/like-status')
	async setLike(
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
		@Body() data: CreateLikeDto,
	) {
		await this.postsService.setLike(param.id, currentUserId, data);
	}
}
