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
import { ObjectIdDto } from '../../../common/dto';
import { BasicAuthGuard } from '../../../common/guards';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RemoveUserCommand } from '../application/commands/remove-user.handler';
import { CreateUserCommand } from '../application/commands/create-user.handler';
import { FindOneUserCommand } from '../application/queries/find-one-user.handler';
import { FindAllUserCommand } from '../application/queries/find-all-user.handler';

@Controller('users')
export class UsersController {
	constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createUser(@Body() data: CreateUserDto) {
		const userId = await this.commandBus.execute(new CreateUserCommand(data, true));
		return this.queryBus.execute(new FindOneUserCommand(userId));
	}

	@Get()
	findAllUsers(@Query() query: QueryUserDto) {
		return this.queryBus.execute(new FindAllUserCommand(query));
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async removeUser(@Param() param: ObjectIdDto) {
		await this.commandBus.execute(new RemoveUserCommand(param.id));
	}
}
