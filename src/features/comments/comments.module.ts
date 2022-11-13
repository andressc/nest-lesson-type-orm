import { PaginationService } from '../application/pagination.service';
import { ValidationService } from '../application/validation.service';
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
import { CommentsRepositoryAdapter } from './adapters/comments.repository.adapter';
import { QueryCommentsRepositoryAdapter } from './adapters/query.comments.repository.adapter';
import { LikesModule } from '../likes/likes.module';
import { BanUnbanCommentHandler } from './application/commands/ban-unban-comment.handler';
import { CreateLikeCommentHandler } from './application/commands/create-like-comment.handler';

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
		provide: QueryCommentsRepositoryAdapter,
		useClass: QueryCommentsRepository,
	},
	{
		provide: CommentsRepositoryAdapter,
		useClass: CommentsRepository,
	},
];
export const Services = [CommentsService, PaginationService, ValidationService];
export const Modules = [
	MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
	CqrsModule,
	UsersModule,
	PostsModule,
	LikesModule,
];

@Module({
	imports: Modules,
	controllers: [CommentsController],
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		{
			provide: CommentsRepositoryAdapter,
			useClass: CommentsRepository,
		},
	],
})
export class CommentsModule {}
