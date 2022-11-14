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
import { PostsRepositoryAdapter } from './adapters/posts.repository.adapter';
import { QueryPostsRepositoryAdapter } from './adapters/query.posts.repository.adapter';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { CreateLikePostHandler } from './application/commands/create-post-comment.handler';
import { PaginationModule } from '../../shared/pagination/pagination.module';

export const CommandHandlers = [
	CreatePostHandler,
	RemovePostHandler,
	UpdatePostHandler,
	CreatePostOfBlogHandler,
	CreateLikePostHandler,
];
export const QueryHandlers = [FindOnePostHandler, FindAllPostHandler];
export const Repositories = [
	{
		provide: QueryPostsRepositoryAdapter,
		useClass: QueryPostsRepository,
	},
	{
		provide: PostsRepositoryAdapter,
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
		QueryPostsRepositoryAdapter,
		{
			provide: QueryPostsRepositoryAdapter,
			useClass: QueryPostsRepository,
		},
		{
			provide: PostsRepositoryAdapter,
			useClass: PostsRepository,
		},
	],
})
export class PostsModule {}
