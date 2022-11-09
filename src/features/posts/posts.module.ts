import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from '../blogs/api/blogs.controller';
import { Blog, BlogSchema } from '../blogs/entity/blog.schema';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsRepository } from '../blogs/infrastructure/repository/blogs.repository';
import { CreateBlogHandler } from '../blogs/application/commands/create-blog.handler';
import { FindOneBlogHandler } from '../blogs/application/queries/find-one-blog.handler';
import { UpdateBlogHandler } from '../blogs/application/commands/update-blog.handler';
import { FindAllBlogHandler } from '../blogs/application/queries/find-all-blog.handler';
import { RemoveBlogHandler } from '../blogs/application/commands/remove-blog.handler';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IsUserCommentValidatorConstraint } from '../../common/decorators/Validation';
import { QueryBlogsRepository } from '../blogs/infrastructure/query/query-blogs.repository';
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
