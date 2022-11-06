import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { User, UserSchema } from '../database/entity';
import { ValidationService, PaginationService } from '../features/application';
import { QueryUsersRepository } from './api/query/query-users.repository';

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
