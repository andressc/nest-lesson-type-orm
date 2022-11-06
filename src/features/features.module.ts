import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	QueryBlogsRepository,
	QueryPostsRepository,
	QueryCommentsRepository,
	QuerySessionsRepository,
} from './api/query';
import {
	BlogsService,
	ValidationService,
	PostsService,
	TestingService,
	CommentsService,
	SessionsService,
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
