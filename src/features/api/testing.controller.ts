import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('testing')
export class TestingController {
	constructor(private readonly testingService: TestingService) {}

	@HttpCode(204)
	@Delete('all-data')
	async removeAll() {
		await this.testingService.removeAll();
	}
}
