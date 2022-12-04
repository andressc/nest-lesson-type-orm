import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ObjectIdDto } from '../../../common/dto';
import { GuestGuard } from '../../../common/guards';
import { QueryBlogDto } from '../dto';
import { QueryPostDto } from '../../posts/dto';
import { CurrentUserIdNonAuthorized } from '../../../common/decorators/Param';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindOneBlogCommand } from '../application/queries/find-one-blog.handler';
import { FindAllBlogCommand } from '../application/queries/find-all-blog.handler';
import { FindAllPostCommand } from '../../posts/application/queries/find-all-post.handler';

@Controller('blogs')
export class BlogsController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@Get()
	findAllBlogs(@Query() query: QueryBlogDto) {
		return this.queryBus.execute(new FindAllBlogCommand(query));
	}

	@Get(':id/posts')
	@UseGuards(GuestGuard)
	findAllPostsOfBlog(
		@Query() query: QueryPostDto,
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
	) {
		return this.queryBus.execute(new FindAllPostCommand(query, currentUserId.id, param.id));
	}

	@Get(':id')
	findOneBlog(@Param() param: ObjectIdDto) {
		return this.queryBus.execute(new FindOneBlogCommand(param.id));
	}
}
