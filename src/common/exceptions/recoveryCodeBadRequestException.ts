import { BadRequestException } from '@nestjs/common';

export class RecoveryCodeBadRequestException extends BadRequestException {
	constructor() {
		super([
			{
				message: 'error recoveryCode',
				field: 'recoveryCode',
			},
		]);
	}
}
