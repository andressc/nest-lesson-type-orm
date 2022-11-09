import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/repository/blogs.repository';
import { CreateBlogHandler } from './application/commands/create-blog.handler';
import { FindOneBlogHandler } from './application/queries/find-one-blog.handler';
import { UpdateBlogHandler } from './application/commands/update-blog.handler';
import { FindAllBlogHandler } from './application/queries/find-all-blog.handler';
import { RemoveBlogHandler } from './application/commands/remove-blog.handler';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IsUserCommentValidatorConstraint } from '../../common/decorators/Validation';
import { QueryBlogsRepository } from './infrastructure/query/query-blogs.repository';
import { Blog, BlogSchema } from './entity/blog.schema';
import { PaginationService } from '../application/pagination.service';

export const CommandHandlers = [CreateBlogHandler, RemoveBlogHandler, UpdateBlogHandler];
export const QueryHandlers = [FindOneBlogHandler, FindAllBlogHandler];

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		UsersModule,
		CqrsModule,
	],
	controllers: [BlogsController],
	providers: [
		BlogsService,

		PaginationService,
		IsUserCommentValidatorConstraint,

		QueryBlogsRepository,

		BlogsRepository,
		...QueryHandlers,
		...CommandHandlers,
	],

	exports: [],
})
export class BlogsModule {}
