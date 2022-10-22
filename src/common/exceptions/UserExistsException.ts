import { BadRequestException } from '@nestjs/common';

export class UserExistsException extends BadRequestException {
	constructor(login: string, email: string) {
		super([
			{
				message: `user login = ${login} or email = ${email} already exists`,
				field: 'email',
			},
		]);
	}
}
