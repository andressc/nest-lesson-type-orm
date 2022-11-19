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
import { ObjectIdDto } from '../../../common/dto';
import { AccessTokenGuard } from '../../../common/guards';
import { CreateBlogDto, QueryBlogDto, UpdateBlogDto } from '../dto';
import { CreatePostOfBlogDto } from '../../posts/dto';
import { CurrentUserId, CurrentUserLogin } from '../../../common/decorators/Param';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindOneBlogCommand } from '../application/queries/find-one-blog.handler';
import { FindAllBlogCommand } from '../application/queries/find-all-blog.handler';
import { CreatePostOfBlogCommand } from '../../posts/application/commands/create-post-of-blog.handler';
import { FindOnePostCommand } from '../../posts/application/queries/find-one-post.handler';
import { UpdateBlogCommand } from '../application/commands/update-blog.handler';
import { CreateBlogCommand } from '../application/commands/create-blog.handler';
import { RemoveBlogCommand } from '../application/commands/remove-blog.handler';
import { UpdatePostOfBlogDto } from '../../posts/dto/update-post-of-blog.dto';
import { UpdatePostCommand } from '../../posts/application/commands/update-post.handler';
import { ObjectIdsDto } from '../../../common/dto/object-ids.dto';
import { RemovePostCommand } from '../../posts/application/commands/remove-post.handler';

@Controller('blogger/blogs')
export class BloggerBlogsController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@UseGuards(AccessTokenGuard)
	@Get()
	findAllBlogs(@Query() query: QueryBlogDto, @CurrentUserId() currentUserId) {
		return this.queryBus.execute(new FindAllBlogCommand(query, currentUserId));
	}

	@UseGuards(AccessTokenGuard)
	@Post()
	async createBlog(
		@Body() data: CreateBlogDto,
		@CurrentUserId() currentUserId,
		@CurrentUserLogin() CurrentUserLogin,
	) {
		const blogId = await this.commandBus.execute(
			new CreateBlogCommand(data, currentUserId, CurrentUserLogin),
		);
		return this.queryBus.execute(new FindOneBlogCommand(blogId));
	}

	@UseGuards(AccessTokenGuard)
	@Post(':id/posts')
	async createPostOfBlog(
		@Body() data: CreatePostOfBlogDto,
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
	) {
		const postId = await this.commandBus.execute(new CreatePostOfBlogCommand(data, param.id));
		return this.queryBus.execute(new FindOnePostCommand(postId, currentUserId));
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':id')
	async updateBlog(
		@Param() param: ObjectIdDto,
		@Body() data: UpdateBlogDto,
		@CurrentUserId() currentUserId,
	) {
		await this.commandBus.execute(new UpdateBlogCommand(param.id, data, currentUserId));
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Delete(':id')
	async removeBlog(@Param() param: ObjectIdDto, @CurrentUserId() currentUserId) {
		await this.commandBus.execute(new RemoveBlogCommand(param.id, currentUserId));
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':blogId/posts/:postId')
	async updatePost(
		@Param() param: ObjectIdsDto,
		@Body() data: UpdatePostOfBlogDto,
		@CurrentUserId() currentUserId,
	) {
		await this.commandBus.execute(
			new UpdatePostCommand(param.blogId, param.postId, data, currentUserId),
		);
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Delete(':blogId/posts/:postId')
	async removePost(@Param() param: ObjectIdsDto, @CurrentUserId() currentUserId) {
		await this.commandBus.execute(new RemovePostCommand(param.blogId, param.postId, currentUserId));
	}
}
