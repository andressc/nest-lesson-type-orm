import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { User, UserSchema } from '../entity/user.schema';
import { ValidationService } from '../features/application/validation.service';
import { QueryUsersRepository } from './api/query/query-users.repository';
import { PaginationService } from '../features/application/pagination.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

	controllers: [UsersController],
	providers: [
		UsersService,
		UsersRepository,
		ValidationService,
		QueryUsersRepository,
		PaginationService,
	],
	exports: [UsersService, UsersRepository, QueryUsersRepository],
})
export class UsersModule {}
