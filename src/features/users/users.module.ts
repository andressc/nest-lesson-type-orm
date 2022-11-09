import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/repository';
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

export const CommandHandlers = [RemoveUserHandler, CreateUserHandler];
export const QueryHandlers = [FindOneUserHandler, FindMeUserHandler, FindAllUserHandler];

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CqrsModule],

	controllers: [UsersController],
	providers: [
		UsersService,
		UsersRepository,
		ValidationService,
		QueryUsersRepository,
		PaginationService,
		...CommandHandlers,
		...QueryHandlers,
	],
	exports: [UsersService, UsersRepository, QueryUsersRepository],
})
export class UsersModule {}
