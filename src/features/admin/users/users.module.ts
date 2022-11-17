import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { QueryUsersRepository } from './infrastructure/query/query-users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveUserHandler } from './application/commands/remove-user.handler';
import { CreateUserHandler } from './application/commands/create-user.handler';
import { FindOneUserHandler } from './application/queries/find-one-user.handler';
import { FindMeUserHandler } from './application/queries/find-me-user.handler';
import { FindAllUserHandler } from './application/queries/find-all-user.handler';
import { User, UserSchema } from './entity/user.schema';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { QueryUsersRepositoryAdapter } from './interfaces/query.users.repository.adapter';
import { BanUnbanUserHandler } from './application/commands/ban-unban-user.handler';
import { SessionsModule } from '../../public/session/sessions.module';
import { LikesModule } from '../../public/likes/likes.module';
import { PaginationModule } from '../../../shared/pagination/pagination.module';
import { UserInjectionToken } from './application/user.injection.token';

export const CommandHandlers = [RemoveUserHandler, CreateUserHandler, BanUnbanUserHandler];
export const QueryHandlers = [FindOneUserHandler, FindMeUserHandler, FindAllUserHandler];
export const Repositories = [
	{
		provide: QueryUsersRepositoryAdapter,
		useClass: QueryUsersRepository,
	},
	{
		provide: UserInjectionToken.USER_REPOSITORY,
		useClass: UsersRepository,
	},
];
export const Services = [UsersService];
export const Modules = [
	MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	SessionsModule,
	CqrsModule,
	LikesModule,
	PaginationModule,
];

@Module({
	imports: Modules,

	controllers: [UsersController],
	providers: [...Services, ...Repositories, ...CommandHandlers, ...QueryHandlers],
	exports: [
		UsersService,
		{
			provide: UserInjectionToken.USER_REPOSITORY,
			useClass: UsersRepository,
		},
	],
})
export class UsersModule {}
