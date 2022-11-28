import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggerBlogsController } from './api/blogger.blogs.controller';
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
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { BlogInjectionToken } from './application/blog.injection.token';
import { AdminBlogsController } from './api/admin.blogs.controller';
import { BlogsController } from './api/blogs.controller';
import { FindAllBlogAdminHandler } from './application/queries/find-all-blog-admin.handler';
import { BindBlogWithUserHandler } from './application/commands/bind-blog-with-user.handler';
import { UsersModule } from '../users/users.module';
import { BanBlogHandler } from './application/commands/ban-blog.handler';
import { FindAllCommentsBlogHandler } from './application/queries/find-all-comments-blog.handler';
import { BanUnbanBlogOfUserHandler } from './application/commands/ban-unban-blog-of-user.handler';
import { Ban, BanSchema } from './entity/ban.schema';
import { BloggerUsersController } from '../users/api/blogger.users.controller';
import { FindAllBannedBlogOfUserHandler } from './application/queries/find-all-banned-blog-of-user.handler';

export const CommandHandlers = [
	CreateBlogHandler,
	RemoveBlogHandler,
	UpdateBlogHandler,
	BindBlogWithUserHandler,
	BanBlogHandler,
	BanUnbanBlogOfUserHandler,
];
export const QueryHandlers = [
	FindOneBlogHandler,
	FindAllBlogHandler,
	FindAllBlogAdminHandler,
	FindAllCommentsBlogHandler,
	FindAllBannedBlogOfUserHandler,
];
export const Repositories = [
	{
		provide: BlogInjectionToken.QUERY_BLOG_REPOSITORY,
		useClass: QueryBlogsRepository,
	},
	{
		provide: BlogInjectionToken.BLOG_REPOSITORY,
		useClass: BlogsRepository,
	},
];
export const Services = [BlogsService, IsUserCommentValidatorConstraint];
export const Modules = [
	MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
	MongooseModule.forFeature([{ name: Ban.name, schema: BanSchema }]),
	CqrsModule,
	PaginationModule,
	UsersModule,
];

@Module({
	imports: Modules,
	controllers: [
		BloggerBlogsController,
		AdminBlogsController,
		BlogsController,
		BloggerUsersController,
	],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		BlogsService,
		{
			provide: BlogInjectionToken.QUERY_BLOG_REPOSITORY,
			useClass: QueryBlogsRepository,
		},
		{
			provide: BlogInjectionToken.BLOG_REPOSITORY,
			useClass: BlogsRepository,
		},
	],
})
export class BlogsModule {}
