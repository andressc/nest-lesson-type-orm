import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './application/commands/create-post.handler';
import { RemovePostHandler } from './application/commands/remove-post.handler';
import { UpdatePostHandler } from './application/commands/update-post.handler';
import { FindOnePostHandler } from './application/queries/find-one-post.handler';
import { FindAllPostHandler } from './application/queries/find-all-post.handler';
import { QueryPostsRepository } from './infrastructure/query/query-posts.repository';
import { PostsRepository } from './infrastructure/repository/posts.repository';
import { PostsService } from './application/posts.service';
import { Post, PostSchema } from './entity/post.schema';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsController } from './api/posts.controller';
import { CreatePostOfBlogHandler } from './application/commands/create-post-of-blog.handler';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { CreateLikePostHandler } from './application/commands/create-post-comment.handler';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { PostInjectionToken } from './application/post.injection.token';
import { BanUnbanPostHandler } from './application/commands/ban-unban-post.handler';

export const CommandHandlers = [
	CreatePostHandler,
	RemovePostHandler,
	UpdatePostHandler,
	CreatePostOfBlogHandler,
	CreateLikePostHandler,
	BanUnbanPostHandler,
];
export const QueryHandlers = [FindOnePostHandler, FindAllPostHandler];
export const Repositories = [
	{
		provide: PostInjectionToken.QUERY_POST_REPOSITORY,
		useClass: QueryPostsRepository,
	},
	{
		provide: PostInjectionToken.POST_REPOSITORY,
		useClass: PostsRepository,
	},
];
export const Services = [PostsService];
export const Modules = [
	MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
	CqrsModule,
	BlogsModule,
	UsersModule,
	LikesModule,
	PaginationModule,
];

@Module({
	imports: Modules,
	controllers: [PostsController],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		PostsService,
		{
			provide: PostInjectionToken.QUERY_POST_REPOSITORY,
			useClass: QueryPostsRepository,
		},
		{
			provide: PostInjectionToken.POST_REPOSITORY,
			useClass: PostsRepository,
		},
	],
})
export class PostsModule {}
