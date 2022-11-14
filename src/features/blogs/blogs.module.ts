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
import { CqrsModule } from '@nestjs/cqrs';
import { QueryBlogsRepository } from './infrastructure/query/query-blogs.repository';
import { Blog, BlogSchema } from './entity/blog.schema';
import { IsUserCommentValidatorConstraint } from '../../common/decorators/Validation';
import { BlogsRepositoryAdapter } from './adapters/blogs.repository.adapter';
import { QueryBlogsRepositoryAdapter } from './adapters/query.blogs.repository.adapter';
import { PaginationModule } from '../../shared/pagination/pagination.module';

export const CommandHandlers = [CreateBlogHandler, RemoveBlogHandler, UpdateBlogHandler];
export const QueryHandlers = [FindOneBlogHandler, FindAllBlogHandler];
export const Repositories = [
	{
		provide: QueryBlogsRepositoryAdapter,
		useClass: QueryBlogsRepository,
	},
	{
		provide: BlogsRepositoryAdapter,
		useClass: BlogsRepository,
	},
];
export const Services = [BlogsService, IsUserCommentValidatorConstraint];
export const Modules = [
	MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
	CqrsModule,
	PaginationModule,
];

@Module({
	imports: Modules,
	controllers: [BlogsController],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		BlogsService,
		{
			provide: QueryBlogsRepositoryAdapter,
			useClass: QueryBlogsRepository,
		},
		{
			provide: BlogsRepositoryAdapter,
			useClass: BlogsRepository,
		},
	],
})
export class BlogsModule {}
