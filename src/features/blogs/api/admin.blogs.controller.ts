import { Controller, Get, HttpCode, Param, Put, Query, UseGuards } from '@nestjs/common';

import { BasicAuthGuard } from '../../../common/guards';
import { QueryBlogDto } from '../dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllBlogAdminCommand } from '../application/queries/find-all-blog-admin.handler';
import { ObjectIdUserDto } from '../../../common/dto/object-id-user.dto';
import { BindBlogWithUserCommand } from '../application/commands/bind-blog-with-user.handler';

@Controller('sa/blogs')
export class AdminBlogsController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@UseGuards(BasicAuthGuard)
	@Get()
	findAllBlogs(@Query() query: QueryBlogDto) {
		return this.queryBus.execute(new FindAllBlogAdminCommand(query));
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Put(':blogId/bind-with-user/:userId')
	async updateBlog(@Param() param: ObjectIdUserDto) {
		await this.commandBus.execute(new BindBlogWithUserCommand(param.userId, param.blogId));
	}
}
