import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '../../../common/guards';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BanUnbanBlogOfUserDto } from '../../blogs/dto/ban-unban-blog-of-user.dto';
import { CurrentUserId } from '../../../common/decorators/Param';
import { ObjectIdDto } from '../../../common/dto';
import { BanUnbanBlogOfUserCommand } from '../../blogs/application/commands/ban-unban-blog-of-user.handler';
import { QueryBlogDto } from '../../blogs/dto';
import { FindAllBannedBlogOfUserCommand } from '../../blogs/application/queries/find-all-banned-blog-of-user.handler';

@Controller('blogger/users')
@UseGuards(AccessTokenGuard)
export class BloggerUsersController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@Put(':id/ban')
	async banUnbanUser(
		@Param() param: ObjectIdDto,
		@Body() data: BanUnbanBlogOfUserDto,
		@CurrentUserId() currentUserId,
	) {
		await this.commandBus.execute(new BanUnbanBlogOfUserCommand(param.id, data, currentUserId));
	}

	@Get('blog/:id')
	findAllBannedUsersOfBlog(
		@Param() param: ObjectIdDto,
		@Query() query: QueryBlogDto,
		@CurrentUserId() currentUserId,
	) {
		return this.queryBus.execute(
			new FindAllBannedBlogOfUserCommand(param.id, query, currentUserId),
		);
	}
}
