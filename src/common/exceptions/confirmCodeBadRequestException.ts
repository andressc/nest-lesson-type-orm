import { BadRequestException } from '@nestjs/common';

export class ConfirmCodeBadRequestException extends BadRequestException {
	constructor() {
		super([
			{
				message: 'error confirm code',
				field: 'code',
			},
		]);
	}
}
