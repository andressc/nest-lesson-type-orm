import { BadRequestException } from '@nestjs/common';

export class IsConfirmedBadRequestException extends BadRequestException {
	constructor() {
		super([{ message: 'email already confirmed', field: 'code' }]);
	}
}
