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
import { ValidationService } from '../application/validation.service';
import { PaginationService } from '../application/pagination.service';
import { UsersRepositoryInterface } from './interface/users.repository.interface';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { QueryUsersRepositoryInterface } from './interface/query.users.repository.interface';

export const CommandHandlers = [RemoveUserHandler, CreateUserHandler];
export const QueryHandlers = [FindOneUserHandler, FindMeUserHandler, FindAllUserHandler];
export const Repositories = [
	{
		provide: QueryUsersRepositoryInterface,
		useClass: QueryUsersRepository,
	},
	{
		provide: UsersRepositoryInterface,
		useClass: UsersRepository,
	},
];
export const Services = [UsersService, ValidationService, PaginationService];
export const Modules = [
	MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	CqrsModule,
];

@Module({
	imports: Modules,

	controllers: [UsersController],
	providers: [...Services, ...Repositories, ...CommandHandlers, ...QueryHandlers],
	exports: [
		UsersService,
		{
			provide: UsersRepositoryInterface,
			useClass: UsersRepository,
		},
	],
})
export class UsersModule {}
