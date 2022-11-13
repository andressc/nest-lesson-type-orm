import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Like, LikeSchema } from './entity/like.schema';
import { LikesRepositoryAdapter } from './adapters/likes.repository.adapter';
import { LikesRepository } from './infrastructure/repository/likes.repository';
import { CreateLikeHandler } from './application/command/create-like.handler';
import { ValidationService } from '../application/validation.service';

export const CommandHandlers = [CreateLikeHandler];
export const QueryHandlers = [];
export const Repositories = [
	{
		provide: LikesRepositoryAdapter,
		useClass: LikesRepository,
	},
];
export const Services = [ValidationService];
export const Modules = [
	MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
	CqrsModule,
];

@Module({
	imports: Modules,
	providers: [...Services, ...Repositories, ...QueryHandlers, ...CommandHandlers],

	exports: [
		{
			provide: LikesRepositoryAdapter,
			useClass: LikesRepository,
		},
	],
})
export class LikesModule {}
