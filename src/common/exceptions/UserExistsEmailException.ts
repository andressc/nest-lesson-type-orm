import { BadRequestException } from '@nestjs/common';

export class UserExistsEmailException extends BadRequestException {
	constructor(email: string) {
		super([
			{
				message: `user email = ${email} already exists`,
				field: 'email',
			},
		]);
	}
}
