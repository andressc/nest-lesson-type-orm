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
import { CreateCommentOfPostDto, CreateLikeDto, QueryCommentDto } from '../dto/comments';
import { CurrentUserId, CurrentUserIdNonAuthorized } from '../../common/decorators/Param';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/posts/commands/create-post.handler';
import { UpdatePostCommand } from '../application/posts/commands/update-post.handler';
import { RemovePostCommand } from '../application/posts/commands/remove-post.handler';
import { SetLikePostCommand } from '../application/posts/commands/set-like-post.handler';
import { CreateCommentOfPostCommand } from '../application/comments/commands/create-comment-of-post.handler';
import { FindOnePostCommand } from '../application/posts/queries/find-one-post.handler';
import { FindAllPostCommand } from '../application/posts/queries/find-all-post.handler';
import { FindOneCommentCommand } from '../application/comments/queries/find-one-comment.handler';
import { FindAllCommentOfPostCommand } from '../application/comments/queries/find-all-comment-of-post.handler';

@Controller('posts')
export class PostsController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createPost(
		@Body() data: CreatePostDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		const postId = await this.commandBus.execute(new CreatePostCommand(data));
		return this.queryBus.execute(new FindOnePostCommand(postId, currentUserId));
	}

	@UseGuards(AccessTokenGuard)
	@Post(':id/comments')
	async createCommentOfPost(
		@Body() data: CreateCommentOfPostDto,
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
	) {
		const commentId = await this.commandBus.execute(
			new CreateCommentOfPostCommand(data, param.id, currentUserId),
		);
		return this.queryBus.execute(new FindOneCommentCommand(commentId, currentUserId));
	}

	@Get()
	@UseGuards(GuestGuard)
	findAllPosts(
		@Query() query: QueryPostDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryBus.execute(new FindAllPostCommand(query, currentUserId));
	}

	@UseGuards(GuestGuard)
	@Get(':id/comments')
	findAllCommentsOfPost(
		@Param() param: ObjectIdDto,
		@Query() query: QueryCommentDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryBus.execute(new FindAllCommentOfPostCommand(query, param.id, currentUserId));
	}

	@Get(':id')
	@UseGuards(GuestGuard)
	findOnePost(
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryBus.execute(new FindOnePostCommand(param.id, currentUserId));
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Put(':id')
	async updatePost(@Param() param: ObjectIdDto, @Body() data: UpdatePostDto) {
		await this.commandBus.execute(new UpdatePostCommand(param.id, data));
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async removePost(@Param() param: ObjectIdDto) {
		await this.commandBus.execute(new RemovePostCommand(param.id));
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':id/like-status')
	async setLike(
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
		@Body() data: CreateLikeDto,
	) {
		await this.commandBus.execute(new SetLikePostCommand(param.id, currentUserId, data));
	}
}
