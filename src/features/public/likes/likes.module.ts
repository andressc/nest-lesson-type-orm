import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Like, LikeSchema } from './entity/like.schema';
import { LikesRepository } from './infrastructure/repository/likes.repository';
import { CreateLikeHandler } from './application/command/create-like.handler';
import { BanUnbanLikeHandler } from './application/command/ban-unban-like.handler';
import { LikeInjectionToken } from './application/like.injection.token';

export const CommandHandlers = [CreateLikeHandler, BanUnbanLikeHandler];
export const QueryHandlers = [];
export const Repositories = [
	{
		provide: LikeInjectionToken.LIKE_REPOSITORY,
		useClass: LikesRepository,
	},
];
export const Services = [];
export const Modules = [
	MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
	CqrsModule,
];

@Module({
	imports: Modules,
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		{
			provide: LikeInjectionToken.LIKE_REPOSITORY,
			useClass: LikesRepository,
		},
	],
})
export class LikesModule {}
