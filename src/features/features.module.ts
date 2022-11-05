import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryBlogsRepository } from './api/query/query-blogs.repository';
import { BlogsService } from './application/blogs.service';
import { Blog, BlogSchema } from '../database/entity/blog.schema';
import { BlogsController } from './api/blogs.controller';
import { BlogsRepository } from './infrastructure/repository/blogs.repository';
import { ValidationService } from './application/validation.service';
import { PostsService } from './application/posts.service';
import { QueryPostsRepository } from './api/query/query-posts.repository';
import { PostsRepository } from './infrastructure/repository/posts.repository';
import { Post, PostSchema } from '../database/entity/post.schema';
import { PostsController } from './api/posts.controller';
import { TestingService } from './application/testing.service';
import { TestingController } from './api/testing.controller';
import { IsUserCommentValidatorConstraint } from '../common/decorators/Validation/validate-blog-id.decorator';
import { PaginationService } from './application/pagination.service';
import { UsersModule } from '../users/users.module';
import { CommentsService } from './application/comments.service';
import { QueryCommentsRepository } from './api/query/query-comments.repository';
import { CommentsRepository } from './infrastructure/repository/comments.repository';
import { CommentsController } from './api/comments.controller';
import { Comment, CommentSchema } from '../database/entity/comment.schema';
import { Session, SessionSchema } from '../database/entity/session.schema';
import { QuerySessionsRepository } from './api/query/query-sessions.repository';
import { SessionsController } from './api/sessions.controller';
import { SessionsService } from './application/sessions.service';
import { SessionsRepository } from './infrastructure/repository/sessions.repository';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
		UsersModule,
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
		TestingService,
		CommentsService,
		SessionsService,

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
	],

	exports: [ValidationService, SessionsRepository, SessionsService],
})
export class FeaturesModule {}
