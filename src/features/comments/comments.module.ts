import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CreateCommentOfPostHandler } from './application/commands/create-comment-of-post.handler';
import { RemoveCommentHandler } from './application/commands/remove-comment.handler';
import { UpdateCommentHandler } from './application/commands/update-comment.handler';
import { FindAllCommentOfPostHandler } from './application/queries/find-all-comment-of-post.handler';
import { FindOneCommentHandler } from './application/queries/find-one-comment.handler';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { QueryCommentsRepository } from './infrastructure/query/query-comments.repository';
import { CommentsRepository } from './infrastructure/repository/comments.repository';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { Comment, CommentSchema } from './entity/comment.schema';
import { LikesModule } from '../likes/likes.module';
import { BanUnbanCommentHandler } from './application/commands/ban-unban-comment.handler';
import { CreateLikeCommentHandler } from './application/commands/create-like-comment.handler';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { CommentInjectionToken } from './application/comment.injection.token';
import { BlogsModule } from '../blogs/blogs.module';

export const CommandHandlers = [
	CreateCommentOfPostHandler,
	RemoveCommentHandler,
	UpdateCommentHandler,
	BanUnbanCommentHandler,
	CreateLikeCommentHandler,
];
export const QueryHandlers = [FindAllCommentOfPostHandler, FindOneCommentHandler];
export const Repositories = [
	{
		provide: CommentInjectionToken.QUERY_COMMENT_REPOSITORY,
		useClass: QueryCommentsRepository,
	},
	{
		provide: CommentInjectionToken.COMMENT_REPOSITORY,
		useClass: CommentsRepository,
	},
];
export const Services = [CommentsService];
export const Modules = [
	MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
	CqrsModule,
	UsersModule,
	PostsModule,
	BlogsModule,
	LikesModule,
	PaginationModule,
];

@Module({
	imports: Modules,
	controllers: [CommentsController],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		{
			provide: CommentInjectionToken.COMMENT_REPOSITORY,
			useClass: CommentsRepository,
		},
	],
})
export class CommentsModule {}
