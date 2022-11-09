import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveAllTestingCommand } from '../application/commands/remove-all-testing.handler';

@Controller('testing')
export class TestingController {
	constructor(private readonly commandBus: CommandBus) {}

	@HttpCode(204)
	@Delete('all-data')
	async removeAll() {
		await this.commandBus.execute(new RemoveAllTestingCommand());
	}
}
