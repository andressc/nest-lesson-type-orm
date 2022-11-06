import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

import { CreateUserDto, QueryUserDto } from '../dto';
import { QueryUsersRepository } from './query/query-users.repository';
import { UsersService } from '../application/users.service';

import { ObjectIdDto } from '../../common/dto/';
import { BasicAuthGuard } from '../../common/guards';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly queryUserRepository: QueryUsersRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createUser(@Body() data: CreateUserDto) {
		const userId = await this.usersService.createUser(data, true);
		return this.queryUserRepository.findOneUser(userId);
	}

	@Get()
	findAllUsers(@Query() query: QueryUserDto) {
		return this.queryUserRepository.findAllUsers(query);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async removeUser(@Param() param: ObjectIdDto) {
		await this.usersService.removeUser(param.id);
	}
}
