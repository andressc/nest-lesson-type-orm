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
import { CreatePostDto, UpdatePostDto, QueryPostDto } from '../dto/posts';
import { PostsService } from '../application/posts.service';
import { QueryPostsRepository } from './query/query-posts.repository';
import { QueryCommentsRepository } from './query/query-comments.repository';
import { QueryCommentDto, CreateCommentOfPostDto, CreateLikeDto } from '../dto/comments';
import { CommentsService } from '../application/comments.service';
import { CurrentUserId, CurrentUserIdNonAuthorized } from '../../common/decorators';
import { GuestGuard } from '../../common/guards/guest.guard';

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
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
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
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
	) {
		return this.queryPostRepository.findAllPosts(query, currentUserId);
	}

	@UseGuards(GuestGuard)
	@Get(':id/comments')
	findAllCommentsOfPost(
		@Param() param: ObjectIdDto,
		@Query() query: QueryCommentDto,
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
	) {
		return this.queryCommentsRepository.findAllCommentsOfPost(query, param.id, currentUserId);
	}

	@Get(':id')
	@UseGuards(GuestGuard)
	findOnePost(
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
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
