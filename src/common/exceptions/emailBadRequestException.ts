import { BadRequestException } from '@nestjs/common';

export class EmailBadRequestException extends BadRequestException {
	constructor() {
		super([{ message: 'error email', field: 'email' }]);
	}
}
