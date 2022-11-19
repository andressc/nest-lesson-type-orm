import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { BasicAuthGuard } from '../../../common/guards';
import { QueryBlogDto } from '../dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllBlogAdminCommand } from '../application/queries/find-all-blog-admin.handler';

@Controller('sa/blogs')
export class AdminBlogsController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@UseGuards(BasicAuthGuard)
	@Get()
	findAllBlogs(@Query() query: QueryBlogDto) {
		return this.queryBus.execute(new FindAllBlogAdminCommand(query));
	}
}
