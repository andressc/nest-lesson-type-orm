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
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { ObjectIdDto } from '../../common/dto/object-id.dto';
import { QueryUsersRepository } from './query/query-users.repository';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly queryUserRepository: QueryUsersRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createBlog(@Body() data: CreateUserDto) {
		const userId = await this.usersService.createUser(data);
		return this.queryUserRepository.findOneUser(userId);
	}

	@Get()
	findAllBlogs(@Query() query: QueryUserDto) {
		return this.queryUserRepository.findAllUsers(query);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async remove(@Param() param: ObjectIdDto) {
		await this.usersService.removeUser(param.id);
	}
}
