import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	QueryPostsRepository,
	QueryCommentsRepository,
	QuerySessionsRepository,
} from './infrastructure/query';
import {
	BlogsService,
	ValidationService,
	PostsService,
	CommentsService,
	PaginationService,
} from './application';
import {
	Blog,
	BlogSchema,
	Post,
	PostSchema,
	Comment,
	CommentSchema,
	Session,
	SessionSchema,
} from '../database/entity';
import {
	BlogsController,
	PostsController,
	TestingController,
	CommentsController,
	SessionsController,
} from './api';
import {
	BlogsRepository,
	PostsRepository,
	CommentsRepository,
	SessionsRepository,
} from './infrastructure/repository';
import { IsUserCommentValidatorConstraint } from '../common/decorators/Validation';
import { UsersModule } from '../users/users.module';
import { CreateBlogHandler } from './application/blogs/commands/create-blog.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveBlogHandler } from './application/blogs/commands/remove-blog.handler';
import { UpdateBlogHandler } from './application/blogs/commands/update-blog.handler';
import { FindOneBlogHandler } from './application/blogs/queries/find-one-blog.handler';
import { FindAllBlogHandler } from './application/blogs/queries/find-all-blog.handler';
import { QueryBlogsRepository } from './infrastructure/query/query-blogs.repository';
import { CreatePostHandler } from './application/posts/commands/create-post.handler';
import { UpdatePostHandler } from './application/posts/commands/update-post.handler';
import { RemovePostHandler } from './application/posts/commands/remove-post.handler';
import { CreatePostOfBlogHandler } from './application/posts/commands/create-post-of-blog.handler';
import { SetLikePostHandler } from './application/posts/commands/set-like-post.handler';
import { UpdateCommentHandler } from './application/comments/commands/update-comment.handler';
import { RemoveCommentHandler } from './application/comments/commands/remove-comment.handler';
import { SetLikeCommentHandler } from './application/comments/commands/set-like-comment.handler';
import { CreateCommentOfPostHandler } from './application/comments/commands/create-comment-of-post.handler';
import { RemoveAllTestingHandler } from './application/testing/commands/remove-all-testing.handler';
import { RemoveAllUserSessionHandler } from './application/sessions/commands/remove-all-user-session.handler';
import { RemoveUserSessionHandler } from './application/sessions/commands/remove-user-session.handler';
import { FindOnePostHandler } from './application/posts/queries/find-one-post.handler';
import { FindAllPostHandler } from './application/posts/queries/find-all-post.handler';
import { FindAllSessionHandler } from './application/sessions/queries/find-all-session.handler';
import { FindOneCommentHandler } from './application/comments/queries/find-one-comment.handler';
import { FindAllCommentOfPostHandler } from './application/comments/queries/find-all-comment-of-post.handler';

export const CommandHandlers = [
	CreateBlogHandler,
	RemoveBlogHandler,
	UpdateBlogHandler,
	CreatePostHandler,
	UpdatePostHandler,
	RemovePostHandler,
	CreatePostOfBlogHandler,
	SetLikePostHandler,
	UpdateCommentHandler,
	RemoveCommentHandler,
	SetLikeCommentHandler,
	CreateCommentOfPostHandler,
	RemoveAllTestingHandler,
	RemoveAllUserSessionHandler,
	RemoveUserSessionHandler,
	FindOnePostHandler,
	FindAllPostHandler,
	FindAllSessionHandler,
	FindOneCommentHandler,
	FindAllCommentOfPostHandler,
];
export const QueryHandlers = [FindOneBlogHandler, FindAllBlogHandler];

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([
			{
				name: Comment.name,
				schema: CommentSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: Session.name,
				schema: SessionSchema,
			},
		]),
		UsersModule,
		CqrsModule,
	],
	controllers: [
		BlogsController,
		PostsController,
		TestingController,
		CommentsController,
		SessionsController,
	],
	providers: [
		BlogsService,
		ValidationService,
		PostsService,
		CommentsService,

		PaginationService,
		IsUserCommentValidatorConstraint,

		QueryBlogsRepository,
		QueryPostsRepository,
		QueryCommentsRepository,
		QuerySessionsRepository,

		BlogsRepository,
		PostsRepository,
		CommentsRepository,
		SessionsRepository,
		...QueryHandlers,
		...CommandHandlers,
	],

	exports: [ValidationService, SessionsRepository],
})
export class FeaturesModule {}
