import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationService } from '../application/pagination.service';
import { ValidationService } from '../application/validation.service';
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
import { PostsRepositoryInterface } from './interface/posts.repository.interface';

export const CommandHandlers = [
	CreatePostHandler,
	RemovePostHandler,
	UpdatePostHandler,
	CreatePostOfBlogHandler,
];
export const QueryHandlers = [FindOnePostHandler, FindAllPostHandler];
export const Repositories = [
	QueryPostsRepository,
	{
		provide: PostsRepositoryInterface,
		useClass: PostsRepository,
	},
];
export const Services = [PostsService, PaginationService, ValidationService];
export const Modules = [
	MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
	CqrsModule,
	BlogsModule,
];

@Module({
	imports: Modules,
	controllers: [PostsController],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		PostsService,
		{
			provide: PostsRepositoryInterface,
			useClass: PostsRepository,
		},
		QueryPostsRepository,
	],
})
export class PostsModule {}
