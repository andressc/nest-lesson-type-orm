import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsUserCommentValidatorConstraint } from '../common/decorators/Validation';
import { UsersModule } from './users/users.module';
import { CreateBlogHandler } from './blogs/application/commands/create-blog.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveBlogHandler } from './blogs/application/commands/remove-blog.handler';
import { UpdateBlogHandler } from './blogs/application/commands/update-blog.handler';
import { FindOneBlogHandler } from './blogs/application/queries/find-one-blog.handler';
import { FindAllBlogHandler } from './blogs/application/queries/find-all-blog.handler';
import { QueryBlogsRepository } from './blogs/infrastructure/query/query-blogs.repository';
import { CreatePostHandler } from './posts/application/commands/create-post.handler';
import { UpdatePostHandler } from './posts/application/commands/update-post.handler';
import { RemovePostHandler } from './posts/application/commands/remove-post.handler';
import { CreatePostOfBlogHandler } from './posts/application/commands/create-post-of-blog.handler';
import { SetLikePostHandler } from './posts/application/commands/set-like-post.handler';
import { UpdateCommentHandler } from './comments/application/commands/update-comment.handler';
import { RemoveCommentHandler } from './comments/application/commands/remove-comment.handler';
import { SetLikeCommentHandler } from './comments/application/commands/set-like-comment.handler';
import { CreateCommentOfPostHandler } from './comments/application/commands/create-comment-of-post.handler';
import { RemoveAllTestingHandler } from './testing/application/commands/remove-all-testing.handler';
import { RemoveAllUserSessionHandler } from './session/application/commands/remove-all-user-session.handler';
import { RemoveUserSessionHandler } from './session/application/commands/remove-user-session.handler';
import { FindOnePostHandler } from './posts/application/queries/find-one-post.handler';
import { FindAllPostHandler } from './posts/application/queries/find-all-post.handler';
import { FindAllSessionHandler } from './session/application/queries/find-all-session.handler';
import { FindOneCommentHandler } from './comments/application/queries/find-one-comment.handler';
import { FindAllCommentOfPostHandler } from './comments/application/queries/find-all-comment-of-post.handler';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs.repository';
import { PostsRepository } from './posts/infrastructure/repository/posts.repository';
import { CommentsRepository } from './comments/infrastructure/repository/comments.repository';
import { SessionsRepository } from './session/infrastructure/repository/sessions.repository';
import { QueryPostsRepository } from './posts/infrastructure/query/query-posts.repository';
import { QueryCommentsRepository } from './comments/infrastructure/query/query-comments.repository';
import { QuerySessionsRepository } from './session/infrastructure/query/query-sessions.repository';
import { Blog, BlogSchema } from './blogs/entity/blog.schema';
import { Post, PostSchema } from './posts/entity/post.schema';
import { Comment, CommentSchema } from './comments/entity/comment.schema';
import { Session, SessionSchema } from './session/entity/session.schema';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsController } from './posts/api/posts.controller';
import { TestingController } from './testing/api/testing.controller';
import { CommentsController } from './comments/api/comments.controller';
import { SessionsController } from './session/api/sessions.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { ValidationService } from './application/validation.service';
import { PostsService } from './posts/application/posts.service';
import { CommentsService } from './comments/application/comments.service';
import { PaginationService } from './application/pagination.service';

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
